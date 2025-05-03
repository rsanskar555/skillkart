import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { interests, goals, weeklyTime, experience } = req.body;
    
    // Validation
    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      return res.status(400).json({ error: 'At least one interest is required' });
    }
    
    if (!goals) {
      return res.status(400).json({ error: 'Goals are required' });
    }
    
    if (!weeklyTime) {
      return res.status(400).json({ error: 'Weekly time commitment is required' });
    }
    
    // Update user profile
    const updatedUser = await User.findOneAndUpdate(
      { uid },
      {
        profile: {
          interests,
          goals,
          weeklyTime,
          experience: experience || 'beginner'
        }
      },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({
      message: 'Profile updated successfully',
      profile: updatedUser.profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

// Update user XP
router.patch('/xp', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { amount } = req.body;
    
    if (typeof amount !== 'number') {
      return res.status(400).json({ error: 'XP amount must be a number' });
    }
    
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update XP and last activity
    user.xp += amount;
    user.lastActivity = new Date();
    
    // Check if the last activity was yesterday and update streak
    const lastActivity = new Date(user.lastActivity);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (
      lastActivity.getDate() === yesterday.getDate() &&
      lastActivity.getMonth() === yesterday.getMonth() &&
      lastActivity.getFullYear() === yesterday.getFullYear()
    ) {
      user.streakDays += 1;
    } else if (
      lastActivity.getDate() !== today.getDate() ||
      lastActivity.getMonth() !== today.getMonth() ||
      lastActivity.getFullYear() !== today.getFullYear()
    ) {
      // Reset streak if last activity was not yesterday or today
      user.streakDays = 1;
    }
    
    await user.save();
    
    // Check if user qualifies for any badges
    let newBadges = [];
    
    // Streak badges
    if (user.streakDays === 5 && !user.badges.find(b => b.id === 'streak-5')) {
      const badge = {
        id: 'streak-5',
        name: '5-Day Streak',
        description: 'Completed activities for 5 consecutive days',
        earnedAt: new Date()
      };
      user.badges.push(badge);
      newBadges.push(badge);
    }
    
    // XP badges
    if (user.xp >= 100 && !user.badges.find(b => b.id === 'xp-100')) {
      const badge = {
        id: 'xp-100',
        name: 'Century Club',
        description: 'Earned 100 XP',
        earnedAt: new Date()
      };
      user.badges.push(badge);
      newBadges.push(badge);
    }
    
    if (newBadges.length > 0) {
      await user.save();
    }
    
    res.status(200).json({
      xp: user.xp,
      streakDays: user.streakDays,
      newBadges
    });
  } catch (error) {
    console.error('Update XP error:', error);
    res.status(500).json({ error: 'Server error updating XP' });
  }
});

// Get user badges
router.get('/badges', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({
      badges: user.badges
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ error: 'Server error retrieving badges' });
  }
});

// Get user gamification data
router.get('/gamification', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Calculate level based on XP
    const level = Math.floor(user.xp / 100) + 1;
    
    res.status(200).json({
      xp: user.xp,
      level,
      streakDays: user.streakDays,
      badges: user.badges,
      lastActivity: user.lastActivity
    });
  } catch (error) {
    console.error('Get gamification data error:', error);
    res.status(500).json({ error: 'Server error retrieving gamification data' });
  }
});

export default router;