import express from 'express';
import Gig from '../models/Gig.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all gigs with filters
router.get('/', async (req, res) => {
    try {
        const { search, skills, location, minPrice, maxPrice, limit } = req.query;

        let filter = { status: 'open' };

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (skills) {
            filter.skillsRequired = { $in: skills.split(',') };
        }

        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        if (minPrice || maxPrice) {
            filter.budget = {};
            if (minPrice) filter.budget.$gte = parseInt(minPrice);
            if (maxPrice) filter.budget.$lte = parseInt(maxPrice);
        }

        let query = Gig.find(filter)
            .populate('client', 'firstName lastName rating')
            .sort({ createdAt: -1 });

        if (limit) {
            query = query.limit(parseInt(limit));
        }

        const gigs = await query;

        res.json(gigs);
    } catch (error) {
        console.error('Get gigs error:', error);
        res.status(500).json({ message: 'Server error fetching gigs' });
    }
});

// Create new gig
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, skillsRequired, budget, location, duration } = req.body;

        const gig = new Gig({
            title,
            description,
            client: req.userId,
            skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : skillsRequired.split(',').map(skill => skill.trim()),
            budget: parseInt(budget),
            location,
            duration
        });
        await gig.save();
        await gig.populate('client', 'firstName lastName');

        res.status(201).json(gig);
    } catch (error) {
        console.error('Create gig error:', error);
        res.status(500).json({ message: 'Server error creating gig' });
    }
});

// Get single gig
router.get('/:id', async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id)
            .populate('client', 'firstName lastName rating')
            .populate('applications.freelancer', 'firstName lastName skills rating');

        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        res.json(gig);
    } catch (error) {
        console.error('Get gig error:', error);
        res.status(500).json({ message: 'Server error fetching gig' });
    }
});

// Apply to gig
router.post('/:id/apply', auth, async (req, res) => {
    try {
        const { proposal, bidAmount } = req.body;

        const gig = await Gig.findById(req.params.id);
        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        if (gig.status !== 'open') {
            return res.status(400).json({ message: 'This gig is no longer accepting applications' });
        }

        // Check if already applied
        const existingApplication = gig.applications.find(
            app => app.freelancer.toString() === req.userId
        );

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied to this gig' });
        }

        gig.applications.push({
            freelancer: req.userId,
            proposal,
            bidAmount: parseInt(bidAmount)
        });

        await gig.save();

        res.json({
            message: 'Application submitted successfully!',
            gig: await gig.populate('applications.freelancer', 'firstName lastName rating')
        });
    } catch (error) {
        console.error('Apply to gig error:', error);
        res.status(500).json({ message: 'Server error applying to gig' });
    }
});

// Accept application
router.put('/:id/accept-application', auth, async (req, res) => {
    try {
        const { applicationId } = req.body;

        const gig = await Gig.findById(req.params.id);
        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        // Check if user is the gig owner
        if (gig.client.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const application = gig.applications.id(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Accept this application and reject others
        gig.applications.forEach(app => {
            if (app._id.toString() === applicationId) {
                app.status = 'accepted';
            } else {
                app.status = 'rejected';
            }
        });

        gig.status = 'in_progress';
        await gig.save();

        res.json({ 
            message: 'Application accepted successfully!', 
            gig: await gig.populate('applications.freelancer', 'firstName lastName rating') 
        });
    } catch (error) {
        console.error('Accept application error:', error);
        res.status(500).json({ message: 'Server error accepting application' });
    }
});

// Reject application
router.put('/:id/reject-application', auth, async (req, res) => {
    try {
        const { applicationId } = req.body;

        const gig = await Gig.findById(req.params.id);
        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        if (gig.client.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const application = gig.applications.id(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = 'rejected';
        await gig.save();

        res.json({ 
            message: 'Application rejected successfully!', 
            gig: await gig.populate('applications.freelancer', 'firstName lastName rating') 
        });
    } catch (error) {
        console.error('Reject application error:', error);
        res.status(500).json({ message: 'Server error rejecting application' });
    }
});

// Get freelancer's applications
router.get('/user/applications', auth, async (req, res) => {
    try {
        const gigs = await Gig.find({
            'applications.freelancer': req.userId
        })
        .populate('client', 'firstName lastName rating')
        .sort({ createdAt: -1 });

        // Extract applications for the current user
        const userApplications = gigs.map(gig => {
            const application = gig.applications.find(app => 
                app.freelancer.toString() === req.userId
            );
            return {
                gig: {
                    _id: gig._id,
                    title: gig.title,
                    budget: gig.budget,
                    location: gig.location,
                    status: gig.status,
                    client: gig.client
                },
                application: application
            };
        });

        res.json(userApplications);
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ message: 'Server error fetching applications' });
    }
});

export default router;