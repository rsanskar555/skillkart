import express from 'express';
import Roadmap from '../models/Roadmap.js';
import User from '../models/User.js';
import { verifyToken, isCurator } from '../middleware/auth.js';

const router = express.Router();

// Get all templates
router.get('/templates', verifyToken, async (req, res) => {
  try {
    const templates = await Roadmap.find({ isTemplate: true });
    res.status(200).json({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Server error retrieving templates' });
  }
});

// Get a specific template by skill
router.get('/templates/:skill', verifyToken, async (req, res) => {
  try {
    const { skill } = req.params;
    
    const template = await Roadmap.findOne({ skill, isTemplate: true });
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.status(200).json({ template });
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ error: 'Server error retrieving template' });
  }
});

// Create a roadmap for a user based on a template
router.post('/', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { skill } = req.body;
    
    if (!skill) {
      return res.status(400).json({ error: 'Skill is required' });
    }
    
    // Find the template
    const template = await Roadmap.findOne({ skill, isTemplate: true });
    if (!template) {
      return res.status(404).json({ error: 'Template not found for this skill' });
    }
    
    // Get user profile to customize roadmap
    const user = await User.findOne({ uid });
    if (!user || !user.profile) {
      return res.status(400).json({ error: 'User profile is required' });
    }
    
    // Customize roadmap based on user's weekly time
    let customizedWeeks = [...template.weeks];
    
    // If user has less than 5 hours per week, reduce the number of steps
    if (user.profile.weeklyTime < 5) {
      customizedWeeks = customizedWeeks.map(week => ({
        ...week,
        steps: week.steps.slice(0, Math.ceil(week.steps.length / 2)) // Take half of the steps
      }));
    }
    
    // Create a new roadmap for the user
    const newRoadmap = new Roadmap({
      userId: uid,
      title: template.title,
      description: template.description,
      skill: template.skill,
      category: template.category,
      totalWeeks: customizedWeeks.length,
      completedWeeks: 0,
      progress: 0,
      imageUrl: template.imageUrl,
      weeks: customizedWeeks,
      isTemplate: false
    });
    
    await newRoadmap.save();
    
    // Award badge for starting first roadmap if applicable
    if (!(await Roadmap.findOne({ userId: uid, _id: { $ne: newRoadmap._id } }))) {
      const firstStepsBadge = {
        id: 'first-roadmap',
        name: 'First Steps',
        description: 'Started your first learning roadmap',
        earnedAt: new Date()
      };
      
      if (!user.badges.find(badge => badge.id === 'first-roadmap')) {
        user.badges.push(firstStepsBadge);
        await user.save();
      }
    }
    
    res.status(201).json({
      message: 'Roadmap created successfully',
      roadmap: newRoadmap,
      newBadge: user.badges.find(badge => badge.id === 'first-roadmap')
    });
  } catch (error) {
    console.error('Create roadmap error:', error);
    res.status(500).json({ error: 'Server error creating roadmap' });
  }
});

// Get all roadmaps for a user
router.get('/user', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    
    const roadmaps = await Roadmap.find({ userId: uid, isTemplate: false });
    
    res.status(200).json({ roadmaps });
  } catch (error) {
    console.error('Get user roadmaps error:', error);
    res.status(500).json({ error: 'Server error retrieving roadmaps' });
  }
});

// Get a specific roadmap
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req.user;
    
    const roadmap = await Roadmap.findById(id);
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }
    
    // Check if the user owns the roadmap or it's a template
    if (roadmap.userId !== uid && !roadmap.isTemplate) {
      return res.status(403).json({ error: 'Not authorized to access this roadmap' });
    }
    
    res.status(200).json({ roadmap });
  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({ error: 'Server error retrieving roadmap' });
  }
});

// Update a step's status in a roadmap
router.patch('/:roadmapId/steps/:stepId', verifyToken, async (req, res) => {
  try {
    const { roadmapId, stepId } = req.params;
    const { uid } = req.user;
    const { status } = req.body;
    
    if (!['not_started', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    // Find the roadmap
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }
    
    // Check if the user owns the roadmap
    if (roadmap.userId !== uid) {
      return res.status(403).json({ error: 'Not authorized to update this roadmap' });
    }
    
    // Find the week and step
    let stepFound = false;
    let weekIndex, stepIndex;
    
    for (let i = 0; i < roadmap.weeks.length; i++) {
      const week = roadmap.weeks[i];
      const sIndex = week.steps.findIndex(s => s._id.toString() === stepId);
      
      if (sIndex !== -1) {
        weekIndex = i;
        stepIndex = sIndex;
        stepFound = true;
        break;
      }
    }
    
    if (!stepFound) {
      return res.status(404).json({ error: 'Step not found in roadmap' });
    }
    
    // Check if status is changing to completed
    const wasCompleted = roadmap.weeks[weekIndex].steps[stepIndex].status === 'completed';
    const isCompleting = status === 'completed' && !wasCompleted;
    
    // Update the step status
    roadmap.weeks[weekIndex].steps[stepIndex].status = status;
    
    // Recalculate progress
    const totalSteps = roadmap.weeks.reduce((acc, week) => acc + week.steps.length, 0);
    const completedSteps = roadmap.weeks.reduce((acc, week) => {
      return acc + week.steps.filter(step => step.status === 'completed').length;
    }, 0);
    
    roadmap.progress = Math.round((completedSteps / totalSteps) * 100);
    
    // Check if week is completed
    const weekCompleted = roadmap.weeks[weekIndex].steps.every(
      step => step.status === 'completed'
    );
    
    if (weekCompleted && !roadmap.weeks[weekIndex].isCompleted) {
      roadmap.weeks[weekIndex].isCompleted = true;
      roadmap.completedWeeks += 1;
    } else if (!weekCompleted && roadmap.weeks[weekIndex].isCompleted) {
      roadmap.weeks[weekIndex].isCompleted = false;
      roadmap.completedWeeks -= 1;
    }
    
    await roadmap.save();
    
    // If the step was just completed, award XP
    let xpUpdate = null;
    if (isCompleting) {
      const user = await User.findOne({ uid });
      
      // Award XP
      const xpAmount = 10; // 10 XP per completed step
      user.xp += xpAmount;
      user.lastActivity = new Date();
      await user.save();
      
      xpUpdate = {
        amount: xpAmount,
        total: user.xp
      };
      
      // Check for skill badges based on progress
      if (roadmap.progress >= 50 && !user.badges.find(b => b.id === `${roadmap.skill}-50`)) {
        const badge = {
          id: `${roadmap.skill}-50`,
          name: `${roadmap.title} Enthusiast`,
          description: `Reached 50% progress in ${roadmap.title} roadmap`,
          earnedAt: new Date()
        };
        user.badges.push(badge);
        await user.save();
      }
    }
    
    res.status(200).json({
      message: 'Step status updated successfully',
      roadmap: {
        progress: roadmap.progress,
        completedWeeks: roadmap.completedWeeks
      },
      xpUpdate
    });
  } catch (error) {
    console.error('Update step status error:', error);
    res.status(500).json({ error: 'Server error updating step status' });
  }
});

// Create a template roadmap (curator only)
router.post('/templates', verifyToken, isCurator, async (req, res) => {
  try {
    const { title, description, skill, category, imageUrl, weeks } = req.body;
    
    // Validation
    if (!title || !skill || !category || !weeks || !Array.isArray(weeks)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create template
    const newTemplate = new Roadmap({
      userId: req.user.uid,
      title,
      description,
      skill,
      category,
      imageUrl,
      weeks,
      totalWeeks: weeks.length,
      isTemplate: true
    });
    
    await newTemplate.save();
    
    res.status(201).json({
      message: 'Template created successfully',
      template: newTemplate
    });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ error: 'Server error creating template' });
  }
});

export default router;