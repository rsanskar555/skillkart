import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Register user in the database (after Firebase Auth registration)
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { uid, email } = req.user;
    
    // Check if user already exists
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user in the database
    const newUser = new User({
      uid,
      email,
      role: 'learner'
    });
    
    await newUser.save();
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        uid,
        email,
        role: 'learner'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({
      user: {
        uid: user.uid,
        email: user.email,
        profile: user.profile,
        xp: user.xp,
        badges: user.badges,
        streakDays: user.streakDays,
        role: user.role,
        hasProfile: !!user.profile?.interests?.length
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error retrieving user data' });
  }
});

export default router;