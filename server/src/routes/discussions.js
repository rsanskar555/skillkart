import express from 'express';
import Discussion from '../models/Discussion.js';
import User from '../models/User.js';
import { verifyToken, isCurator } from '../middleware/auth.js';

const router = express.Router();

// Get discussions for a roadmap
router.get('/roadmap/:roadmapId', verifyToken, async (req, res) => {
  try {
    const { roadmapId } = req.params;
    
    const discussions = await Discussion.find({ roadmapId }).sort({ createdAt: -1 });
    
    // Get user info for each discussion and reply
    const discussionsWithUserInfo = await Promise.all(
      discussions.map(async (discussion) => {
        const user = await User.findOne({ uid: discussion.userId });
        
        const repliesWithUserInfo = await Promise.all(
          discussion.replies.map(async (reply) => {
            const replyUser = await User.findOne({ uid: reply.userId });
            
            return {
              ...reply.toObject(),
              user: {
                id: replyUser?.uid || 'unknown',
                name: replyUser?.email?.split('@')[0] || 'Unknown User',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  replyUser?.email?.split('@')[0] || 'U'
                )}&background=random`
              }
            };
          })
        );
        
        return {
          ...discussion.toObject(),
          user: {
            id: user?.uid || 'unknown',
            name: user?.email?.split('@')[0] || 'Unknown User',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.email?.split('@')[0] || 'U'
            )}&background=random`
          },
          replies: repliesWithUserInfo
        };
      })
    );
    
    res.status(200).json({ discussions: discussionsWithUserInfo });
  } catch (error) {
    console.error('Get discussions error:', error);
    res.status(500).json({ error: 'Server error retrieving discussions' });
  }
});

// Create a new discussion
router.post('/roadmap/:roadmapId', verifyToken, async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { uid } = req.user;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    // Create discussion
    const newDiscussion = new Discussion({
      roadmapId,
      userId: uid,
      content,
      replies: []
    });
    
    await newDiscussion.save();
    
    // Get user info
    const user = await User.findOne({ uid });
    
    const discussionWithUserInfo = {
      ...newDiscussion.toObject(),
      user: {
        id: uid,
        name: user?.email?.split('@')[0] || 'Unknown User',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user?.email?.split('@')[0] || 'U'
        )}&background=random`
      }
    };
    
    res.status(201).json({
      message: 'Discussion created successfully',
      discussion: discussionWithUserInfo
    });
  } catch (error) {
    console.error('Create discussion error:', error);
    res.status(500).json({ error: 'Server error creating discussion' });
  }
});

// Add a reply to a discussion
router.post('/:discussionId/replies', verifyToken, async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { uid } = req.user;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    // Find the discussion
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }
    
    // Add reply
    const reply = {
      userId: uid,
      content,
      createdAt: new Date()
    };
    
    discussion.replies.push(reply);
    await discussion.save();
    
    // Get user info
    const user = await User.findOne({ uid });
    
    const replyWithUserInfo = {
      ...reply,
      user: {
        id: uid,
        name: user?.email?.split('@')[0] || 'Unknown User',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user?.email?.split('@')[0] || 'U'
        )}&background=random`
      }
    };
    
    res.status(201).json({
      message: 'Reply added successfully',
      reply: replyWithUserInfo
    });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ error: 'Server error adding reply' });
  }
});

// Delete a discussion (owner or curator)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { uid, role } = req.user;
    
    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }
    
    // Check if user is the owner or a curator
    if (discussion.userId !== uid && role !== 'curator') {
      return res.status(403).json({ error: 'Not authorized to delete this discussion' });
    }
    
    await Discussion.findByIdAndDelete(id);
    
    res.status(200).json({
      message: 'Discussion deleted successfully'
    });
  } catch (error) {
    console.error('Delete discussion error:', error);
    res.status(500).json({ error: 'Server error deleting discussion' });
  }
});

// Delete a reply (owner or curator)
router.delete('/:discussionId/replies/:replyId', verifyToken, async (req, res) => {
  try {
    const { discussionId, replyId } = req.params;
    const { uid, role } = req.user;
    
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }
    
    // Find the reply
    const replyIndex = discussion.replies.findIndex(
      reply => reply._id.toString() === replyId
    );
    
    if (replyIndex === -1) {
      return res.status(404).json({ error: 'Reply not found' });
    }
    
    // Check if user is the owner or a curator
    if (discussion.replies[replyIndex].userId !== uid && role !== 'curator') {
      return res.status(403).json({ error: 'Not authorized to delete this reply' });
    }
    
    // Remove the reply
    discussion.replies.splice(replyIndex, 1);
    await discussion.save();
    
    res.status(200).json({
      message: 'Reply deleted successfully'
    });
  } catch (error) {
    console.error('Delete reply error:', error);
    res.status(500).json({ error: 'Server error deleting reply' });
  }
});

export default router;