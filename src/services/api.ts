import axios from 'axios';
import { getAuth } from 'firebase/auth';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API service functions
export const authAPI = {
  register: async () => {
    const response = await api.post('/auth/register');
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const profileAPI = {
  updateProfile: async (profileData: any) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  
  getGamification: async () => {
    const response = await api.get('/users/gamification');
    return response.data;
  },
  
  updateXP: async (amount: number) => {
    const response = await api.patch('/users/xp', { amount });
    return response.data;
  }
};

export const roadmapAPI = {
  getTemplates: async () => {
    const response = await api.get('/roadmaps/templates');
    return response.data;
  },
  
  getTemplateBySkill: async (skill: string) => {
    const response = await api.get(`/roadmaps/templates/${skill}`);
    return response.data;
  },
  
  createRoadmap: async (skill: string) => {
    const response = await api.post('/roadmaps', { skill });
    return response.data;
  },
  
  getUserRoadmaps: async () => {
    const response = await api.get('/roadmaps/user');
    return response.data;
  },
  
  getRoadmap: async (id: string) => {
    const response = await api.get(`/roadmaps/${id}`);
    return response.data;
  },
  
  updateStepStatus: async (roadmapId: string, stepId: string, status: string) => {
    const response = await api.patch(`/roadmaps/${roadmapId}/steps/${stepId}`, { status });
    return response.data;
  }
};

export const resourceAPI = {
  getResourcesByStep: async (stepId: string) => {
    const response = await api.get(`/resources/step/${stepId}`);
    return response.data;
  }
};

export const discussionAPI = {
  getDiscussionsByRoadmap: async (roadmapId: string) => {
    const response = await api.get(`/discussions/roadmap/${roadmapId}`);
    return response.data;
  },
  
  createDiscussion: async (roadmapId: string, content: string) => {
    const response = await api.post(`/discussions/roadmap/${roadmapId}`, { content });
    return response.data;
  },
  
  addReply: async (discussionId: string, content: string) => {
    const response = await api.post(`/discussions/${discussionId}/replies`, { content });
    return response.data;
  }
};

export default api;