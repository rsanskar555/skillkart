import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Register user in the database (after Firebase Auth registration)
// routes/auth.js
router.post('/', verifyToken, async (req, res) => {
    try {
      const { uid, email } = req.user;
      const { skill } = req.body;
  
      // 1. Check or create user
      let user = await User.findOne({ uid });
      if (!user) {
        user = new User({ uid, email, profile: { experience: 'beginner' } });
        await user.save();
      }
  
      // 2. Find template
      const template = await Roadmap.findOne({ 
        skill: { $regex: new RegExp(skill, 'i') },
        isTemplate: true 
      });
  
      if (!template) {
        return res.status(404).json({ 
          error: 'Template not found',
          availableSkills: await Roadmap.distinct('skill', { isTemplate: true }),
          suggestion: 'Try one of the available skills'
        });
      }
  
      // 3. Check user profile
      if (!user.profile) {
        return res.status(400).json({ 
          error: 'Profile incomplete',
          solution: 'Please complete your profile before creating roadmaps'
        });
      }
  
      // 4. Customize weeks based on user's available time
      let customizedWeeks = template.weeks.map(week => ({ ...week._doc }));
      
      if (user.profile.weeklyTime < 5) {
        customizedWeeks = customizedWeeks.map(week => ({
          ...week,
          steps: week.steps.slice(0, Math.max(1, Math.floor(week.steps.length / 2)))
        }));
      }
  
      // 5. Create new roadmap
      const newRoadmap = new Roadmap({
        userId: uid,
        title: `${template.title} - ${user.profile.name || 'My Roadmap'}`,
        description: template.description,
        skill: template.skill,
        category: template.category,
        totalWeeks: customizedWeeks.length,
        completedWeeks: 0,
        progress: 0,
        imageUrl: template.imageUrl || '/default-roadmap.jpg',
        weeks: customizedWeeks,
        isTemplate: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
  
      await newRoadmap.save();
  
      // 6. Award first roadmap badge if applicable
      const hasExistingRoadmaps = await Roadmap.exists({ 
        userId: uid, 
        _id: { $ne: newRoadmap._id } 
      });
  
      if (!hasExistingRoadmaps) {
        const firstStepsBadge = {
          id: 'first-roadmap',
          name: 'First Steps',
          description: 'Started your first learning roadmap',
          earnedAt: new Date()
        };
        
        if (!user.badges.some(badge => badge.id === 'first-roadmap')) {
          user.badges.push(firstStepsBadge);
          await user.save();
        }
      }
  
      res.status(201).json({
        message: 'Roadmap created successfully',
        roadmap: newRoadmap,
        newBadge: user.badges.find(badge => badge.id === 'first-roadmap') || null
      });
      
    } catch (error) {
      console.error('Create roadmap error:', error);
      res.status(500).json({ 
        error: 'Server error creating roadmap',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
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