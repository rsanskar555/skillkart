import express from 'express';
import Roadmap from '../models/Roadmap.js';
import User from '../models/User.js';
import { verifyToken, isCurator } from '../middleware/auth.js';

const router = express.Router();

// Get all templates (public endpoint)
router.get('/templates', async (req, res) => {
  try {
    console.log('GET /templates: Request received');
    const templates = await Roadmap.find({ isTemplate: true });
    console.log('GET /templates: Found templates:', templates);
    if (!templates || templates.length === 0) {
      console.log('GET /templates: No templates found in database');
      return res.status(404).json({ error: 'No templates found' });
    }
    res.status(200).json({ templates });
  } catch (error) {
    console.error('GET /templates: Error:', error.message);
    res.status(500).json({ error: 'Server error retrieving templates' });
  }
});

// Get a specific template by skill (public endpoint)
router.get('/templates/:skill', async (req, res) => {
  try {
    const { skill } = req.params;
    console.log('GET /templates/:skill: Looking for skill:', skill);
    
    const template = await Roadmap.findOne({ 
      skill: { $regex: new RegExp(`^${skill}$`, 'i') }, // Case-insensitive search
      isTemplate: true 
    });
    
    if (!template) {
      console.log('GET /templates/:skill: Template not found for skill:', skill);
      // Get available skills for better error message
      const availableSkills = await Roadmap.distinct('skill', { isTemplate: true });
      console.log('GET /templates/:skill: Available skills:', availableSkills);
      return res.status(404).json({ 
        error: 'Template not found',
        availableSkills,
        suggestion: 'Try one of the available skills'
      });
    }
    
    console.log('GET /templates/:skill: Found template:', template);
    res.status(200).json({ template });
  } catch (error) {
    console.error('GET /templates/:skill: Error:', error.message);
    res.status(500).json({ error: 'Server error retrieving template' });
  }
});

// Create a roadmap for a user based on a template
router.post('/', verifyToken, async (req, res) => {
  try {
    const { uid, email } = req.user;
    const { skill } = req.body;

    console.log('POST /roadmaps: Creating roadmap for user:', uid, 'with skill:', skill);

    // 1. Check or create user
    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ 
        uid, 
        email, 
        profile: { experience: 'beginner' } 
      });
      await user.save();
      console.log('POST /roadmaps: Created new user:', user);
    }

    // 2. Find template
    const template = await Roadmap.findOne({ 
      skill: { $regex: new RegExp(`^${skill}$`, 'i') },
      isTemplate: true 
    });

    if (!template) {
      console.log('POST /roadmaps: Template not found for skill:', skill);
      return res.status(404).json({ 
        error: 'Template not found',
        availableSkills: await Roadmap.distinct('skill', { isTemplate: true }),
        suggestion: 'Try one of the available skills'
      });
    }
    console.log('POST /roadmaps: Found template:', template);

    // 3. Check profile
    if (!user.profile) {
      console.log('POST /roadmaps: User profile incomplete');
      return res.status(400).json({ 
        error: 'Profile incomplete',
        solution: 'Please complete your profile'
      });
    }

    // 4. Customize weeks
    let customizedWeeks = template.weeks.map(week => ({ ...week._doc }));
    if (user.profile.weeklyTime < 5) {
      customizedWeeks = customizedWeeks.map(week => ({
        ...week,
        steps: week.steps.slice(0, Math.max(1, Math.floor(week.steps.length / 2)))
      }));
    }

    // 5. Create roadmap
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
      isTemplate: false
    });
    await newRoadmap.save();
    console.log('POST /roadmaps: Created new roadmap:', newRoadmap);

    // 6. Award badge
    let newBadge = null;
    const isFirstRoadmap = !(await Roadmap.exists({ userId: uid, _id: { $ne: newRoadmap._id } }));
    
    if (isFirstRoadmap) {
      newBadge = {
        id: 'first-roadmap',
        name: 'First Steps',
        description: 'Started your first learning roadmap',
        earnedAt: new Date()
      };
      user.badges.push(newBadge);
      await user.save();
      console.log('POST /roadmaps: Awarded badge:', newBadge);
    }

    // 7. Success response
    res.status(201).json({
      message: 'Roadmap created successfully',
      roadmap: {
        ...newRoadmap.toObject(),
        id: newRoadmap._id,
        lastActivity: newRoadmap.updatedAt
      },
      newBadge
    });
  } catch (error) {
    console.error('POST /roadmaps: Error:', error.message);
    res.status(500).json({ 
      error: 'Server error creating roadmap',
      details: error.message
    });
  }
});

// Get all roadmaps for a user
router.get('/user', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    console.log('GET /roadmaps/user: Fetching roadmaps for user:', uid);
    const roadmaps = await Roadmap.find({ userId: uid, isTemplate: false });
    console.log('GET /roadmaps/user: Found roadmaps:', roadmaps);
    res.status(200).json({ roadmaps });
  } catch (error) {
    console.error('GET /roadmaps/user: Error:', error.message);
    res.status(500).json({ error: 'Server error retrieving roadmaps' });
  }
});

// Get a specific roadmap
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req.user;
    console.log('GET /roadmaps/:id: Fetching roadmap with id:', id);
    const roadmap = await Roadmap.findById(id);
    if (!roadmap) {
      console.log('GET /roadmaps/:id: Roadmap not found');
      return res.status(404).json({ error: 'Roadmap not found' });
    }
    
    // Check if the user owns the roadmap or it's a template
    if (roadmap.userId !== uid && !roadmap.isTemplate) {
      console.log('GET /roadmaps/:id: User not authorized');
      return res.status(403).json({ error: 'Not authorized to access this roadmap' });
    }
    
    console.log('GET /roadmaps/:id: Found roadmap:', roadmap);
    res.status(200).json({ roadmap });
  } catch (error) {
    console.error('GET /roadmaps/:id: Error:', error.message);
    res.status(500).json({ error: 'Server error retrieving roadmap' });
  }
});

// Update a step's status in a roadmap
// Update a step's status in a roadmap
router.patch('/:roadmapId/steps/:stepId', verifyToken, async (req, res) => {
  try {
    const { roadmapId, stepId } = req.params;
    const { uid } = req.user;
    const { status } = req.body;
    console.log('PATCH /roadmaps/:roadmapId/steps/:stepId: Updating step:', stepId, 'in roadmap:', roadmapId);

    if (!['not_started', 'in_progress', 'completed'].includes(status)) {
      console.log("PATCH /roadmaps/:roadmapId/steps/:stepId: Invalid status");
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    // Find the roadmap
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      console.log('PATCH /roadmaps/:roadmapId/steps/:stepId: Roadmap not found');
      return res.status(404).json({ error: 'Roadmap not found' });
    }
    
    // Check if the user owns the roadmap
    if (roadmap.userId !== uid) {
      console.log('PATCH /roadmaps/:roadmapId/steps/:stepId: User not authorized');
      return res.status(403).json({ error: 'Not authorized to update this roadmap' });
    }
    
    // Find the week and step
    let stepFound = false;
    let weekIndex = -1;
    let stepIndex = -1;
    
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
      console.log('PATCH /roadmaps/:roadmapId/steps/:stepId: Step not found');
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
    
    roadmap.progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    
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
    
    // Mark the weeks array as modified so Mongoose saves the changes
    roadmap.markModified('weeks');
    await roadmap.save();
    console.log('PATCH /roadmaps/:roadmapId/steps/:stepId: Updated roadmap:', roadmap);
    
    // If the step was just completed, award XP
    let xpUpdate = null;
    if (isCompleting) {
      const user = await User.findOne({ uid });
      
      if (!user) {
        console.log('PATCH /roadmaps/:roadmapId/steps/:stepId: User not found');
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Initialize badges if undefined
      user.badges = user.badges || [];
      
      // Award XP
      const xpAmount = 10; // 10 XP per completed step
      user.xp = (user.xp || 0) + xpAmount;
      user.lastActivity = new Date();
      await user.save();
      
      xpUpdate = {
        amount: xpAmount,
        total: user.xp
      };
      console.log('PATCH /roadmaps/:roadmapId/steps/:stepId: Awarded XP:', xpUpdate);
      
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
        console.log('PATCH /roadmaps/:roadmapId/steps/:stepId: Awarded badge:', badge);
      }
    }
    
    res.status(200).json({
      message: 'Step status updated successfully',
      roadmap: {
        ...roadmap.toObject(),
        id: roadmap._id,
        lastActivity: roadmap.updatedAt,
      },
      xpUpdate,
    });
  } catch (error) {
    console.error('PATCH /roadmaps/:roadmapId/steps/:stepId: Error:', error);
    res.status(500).json({ 
      error: 'Server error updating step status',
      details: error.message
    });
  }
});

// Create a template roadmap (curator only)
router.post('/templates', verifyToken, isCurator, async (req, res) => {
  try {
    const { title, description, skill, category, imageUrl, weeks } = req.body;
    console.log('POST /templates: Creating template:', { title, skill });

    // Validation
    if (!title || !skill || !category || !weeks || !Array.isArray(weeks)) {
      console.log('POST /templates: Missing required fields');
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
    console.log('POST /templates: Created template:', newTemplate);
    
    res.status(201).json({
      message: 'Template created successfully',
      template: newTemplate
    });
  } catch (error) {
    console.error('POST /templates: Error:', error.message);
    res.status(500).json({ error: 'Server error creating template' });
  }
});

export default router;