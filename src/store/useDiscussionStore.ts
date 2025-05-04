import { create } from 'zustand';
import { discussionAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Reply {
  id: string;
  user: User;
  content: string;
  timestamp: string;
}

interface Discussion {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  replies: Reply[];
}

interface DiscussionState {
  discussions: Discussion[];
  isLoading: boolean;
  error: string | null;
  
  fetchDiscussions: (roadmapId: string) => Promise<void>;
  addDiscussion: (roadmapId: string, content: string) => Promise<void>;
  addReply: (discussionId: string, content: string) => Promise<void>;
}

export const useDiscussionStore = create<DiscussionState>((set, get) => ({
  discussions: [],
  isLoading: false,
  error: null,
  
  fetchDiscussions: async (roadmapId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { discussions } = await discussionAPI.getDiscussionsByRoadmap(roadmapId);
      
      set({
        discussions,
        isLoading: false,
        error: null, // Explicitly include all properties
      });
    } catch (error) {
      console.error('Fetch discussions error:', error);
      set({
        error: 'Failed to fetch discussions. Please try again.',
        isLoading: false,
      });
    }
  },
  
  addDiscussion: async (roadmapId: string, content: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { discussion } = await discussionAPI.createDiscussion(roadmapId, content);
      
      set(state => ({
        discussions: [discussion, ...state.discussions],
        isLoading: false,
        error: null, // Explicitly include all properties
      }));
    } catch (error) {
      console.error('Add discussion error:', error);
      set({
        error: 'Failed to add discussion. Please try again.',
        isLoading: false,
      });
    }
  },
  
  addReply: async (discussionId: string, content: string) => {
    set({ isLoading: true, error: null }); // Add isLoading for consistency
    
    try {
      const { reply } = await discussionAPI.addReply(discussionId, content);
      
      set(state => ({
        discussions: state.discussions.map(discussion => 
          discussion.id === discussionId
            ? {
                ...discussion,
                replies: [...discussion.replies, reply]
              }
            : discussion
        ),
        isLoading: false,
        error: null, // Explicitly include all properties
      }));
    } catch (error) {
      console.error('Add reply error:', error);
      set({
        error: 'Failed to add reply. Please try again.',
        isLoading: false,
      });
    }
  },
}));