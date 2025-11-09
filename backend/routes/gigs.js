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
      message: 'Application submitted successfully',
      gig 
    });
  } catch (error) {
    console.error('Apply to gig error:', error);
    res.status(500).json({ message: 'Server error applying to gig' });
  }
});

export default router;