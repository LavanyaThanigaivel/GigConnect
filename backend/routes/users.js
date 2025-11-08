import express from 'express';
import User from '../models/User.js';
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

export default router;