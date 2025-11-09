import express from 'express';
import User from '../models/User.js';
import Gig from '../models/Gig.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all freelancers
router.get('/freelancers', async (req, res) => {
  try {
    const { search, skills, location } = req.query;
    
    let filter = { userType: 'freelancer' };
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (skills) {
      filter.skills = { $in: skills.split(',') };
    }
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    const freelancers = await User.find(filter)
      .select('-password')
      .sort({ rating: -1, createdAt: -1 });
    
    res.json(freelancers);
  } catch (error) {
    console.error('Get freelancers error:', error);
    res.status(500).json({ message: 'Server error fetching freelancers' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('reviews.user', 'firstName lastName');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { bio, hourlyRate, skills, location } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (bio !== undefined) user.bio = bio;
    if (hourlyRate !== undefined) user.hourlyRate = parseInt(hourlyRate) || 0;
    if (skills !== undefined) {
      user.skills = Array.isArray(skills) 
        ? skills 
        : skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    }
    if (location !== undefined) user.location = location;
    
    user.profileCompleted = true;
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        skills: user.skills,
        location: user.location,
        bio: user.bio,
        hourlyRate: user.hourlyRate,
        rating: user.rating,
        profileCompleted: user.profileCompleted
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Get dashboard statistics
router.get('/dashboard/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    let stats = {};

    if (user.userType === 'freelancer') {
      // Freelancer stats
      const gigs = await Gig.find({
        'applications.freelancer': req.userId
      });

      const applications = gigs.flatMap(gig => 
        gig.applications.filter(app => app.freelancer.toString() === req.userId)
      );

      stats = {
        totalApplications: applications.length,
        pendingApplications: applications.filter(app => app.status === 'pending').length,
        earnings: applications
          .filter(app => app.status === 'accepted')
          .reduce((total, app) => total + app.bidAmount, 0),
        totalGigs: await Gig.countDocuments({ status: 'open' }), // Available gigs
        activeGigs: applications.filter(app => app.status === 'accepted').length,
        unreadMessages: 0 // You can implement this later
      };

    } else {
      // Client stats
      const clientGigs = await Gig.find({ client: req.userId });

      stats = {
        totalGigs: clientGigs.length,
        activeGigs: clientGigs.filter(gig => 
          gig.status === 'open' || gig.status === 'in_progress'
        ).length,
        totalApplications: clientGigs.reduce(
          (total, gig) => total + gig.applications.length, 0
        ),
        earnings: 0, // Not used for clients in your current design
        pendingApplications: 0, // Not used for clients
        unreadMessages: 0
      };
    }

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
});

// Add review to user
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user already reviewed
    const existingReview = user.reviews.find(
      review => review.user.toString() === req.userId
    );
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this user' });
    }
    
    // Add review
    user.reviews.push({
      user: req.userId,
      rating: parseInt(rating),
      comment
    });
    
    // Recalculate average rating
    const totalRating = user.reviews.reduce((sum, review) => sum + review.rating, 0);
    user.rating = totalRating / user.reviews.length;
    
    await user.save();
    await user.populate('reviews.user', 'firstName lastName');
    
    res.json({
      message: 'Review added successfully',
      reviews: user.reviews
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error adding review' });
  }
});

// Get all users for messaging (contacts list)
router.get('/contacts/list', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    
    // For clients: show all freelancers
    // For freelancers: show all clients
    const filter = { 
      _id: { $ne: req.userId } // Exclude current user
    };
    
    if (currentUser.userType === 'client') {
      filter.userType = 'freelancer';
    } else {
      filter.userType = 'client';
    }
    
    const contacts = await User.find(filter)
      .select('firstName lastName email userType skills location rating bio')
      .sort({ firstName: 1 });
    
    res.json(contacts);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error fetching contacts' });
  }
});

// Search users for messaging
router.get('/contacts/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    const currentUser = await User.findById(req.userId);
    
    const filter = { 
      _id: { $ne: req.userId },
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { skills: { $in: [new RegExp(query, 'i')] } }
      ]
    };
    
    if (currentUser.userType === 'client') {
      filter.userType = 'freelancer';
    } else {
      filter.userType = 'client';
    }
    
    const contacts = await User.find(filter)
      .select('firstName lastName email userType skills location rating bio')
      .limit(20)
      .sort({ rating: -1, firstName: 1 });
    
    res.json(contacts);
  } catch (error) {
    console.error('Search contacts error:', error);
    res.status(500).json({ message: 'Server error searching contacts' });
  }
});

export default router;