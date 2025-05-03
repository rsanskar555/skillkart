import express from 'express';
import Resource from '../models/Resource.js';
import { verifyToken, isCurator } from '../middleware/auth.js';

const router = express.Router();

// Get resources for a step
router.get('/step/:stepId', verifyToken, async (req, res) => {
  try {
    const { stepId } = req.params;
    
    const resources = await Resource.find({ stepId });
    
    res.status(200).json({ resources });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ error: 'Server error retrieving resources' });
  }
});

// Add a new resource (curators only)
router.post('/', verifyToken, isCurator, async (req, res) => {
  try {
    const { title, type, url, description, stepId } = req.body;
    
    // Validation
    if (!title || !type || !url || !stepId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!['video', 'blog', 'quiz'].includes(type)) {
      return res.status(400).json({ error: 'Invalid resource type' });
    }
    
    // Create resource
    const newResource = new Resource({
      title,
      type,
      url,
      description,
      stepId,
      uploadedBy: req.user.uid
    });
    
    await newResource.save();
    
    res.status(201).json({
      message: 'Resource created successfully',
      resource: newResource
    });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ error: 'Server error creating resource' });
  }
});

// Update a resource (curators only)
router.put('/:id', verifyToken, isCurator, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, description } = req.body;
    
    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    // Check if the curator owns the resource
    if (resource.uploadedBy !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized to update this resource' });
    }
    
    // Update fields
    if (title) resource.title = title;
    if (url) resource.url = url;
    if (description !== undefined) resource.description = description;
    
    await resource.save();
    
    res.status(200).json({
      message: 'Resource updated successfully',
      resource
    });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ error: 'Server error updating resource' });
  }
});

// Delete a resource (curators only)
router.delete('/:id', verifyToken, isCurator, async (req, res) => {
  try {
    const { id } = req.params;
    
    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    // Check if the curator owns the resource
    if (resource.uploadedBy !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized to delete this resource' });
    }
    
    await Resource.findByIdAndDelete(id);
    
    res.status(200).json({
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ error: 'Server error deleting resource' });
  }
});

export default router;