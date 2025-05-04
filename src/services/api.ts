import axios, { AxiosResponse } from 'axios';
import { getAuth } from 'firebase/auth';

// Define interfaces for response shapes
interface Template {
  _id: string;
  skill: string;
  title: string;
  category: string;
  totalWeeks: number;
  weeks: Week[];
  imageUrl?: string;
}

interface Week {
  id: string;
  title: string;
  steps: Step[];
  isExpanded?: boolean;
  isCompleted?: boolean;
}

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  resources: { id: string; title: string; type: string }[];
}

interface Roadmap {
  id: string;
  userId?: string;
  title: string;
  description: string;
  skill: string;
  category: string;
  progress: number;
  totalWeeks: number;
  completedWeeks: number;
  lastActivity: Date;
  imageUrl: string;
  weeks: Week[];
  isTemplate?: boolean;
}

interface UserProfile {
  interests: string[];
  goals: string;
  weeklyTime: number;
  experience: string;
}

interface User {
  uid: string;
  email: string | null;
  hasProfile: boolean;
  profile?: UserProfile;
}

interface TemplatesResponse {
  templates: Template[];
}

interface TemplateResponse {
  template: Template;
}

interface RoadmapsResponse {
  roadmaps: Roadmap[];
}

interface RoadmapResponse {
  roadmap: Roadmap;
}

interface Resource {
  id: string;
  title: string;
  type: string;
}

interface ResourcesResponse {
  resources: Resource[];
}

interface DiscussionUser {
  id: string;
  name: string;
  avatar: string;
}

interface Discussion {
  id: string;
  roadmapId: string;
  content: string;
  replies: Reply[];
  user: DiscussionUser;
  timestamp: string;
}

interface Reply {
  id: string;
  user: DiscussionUser;
  content: string;
  timestamp: string;
}

interface DiscussionsResponse {
  discussions: Discussion[];
}

interface DiscussionResponse {
  discussion: Discussion;
}

interface ReplyResponse {
  reply: Reply;
}

interface GamificationResponse {
  xp: number;
  level: number;
  badges: string[];
}

interface UpdateXPResponse {
  xp: number;
  level: number;
}

// Define a custom Axios instance type to reflect the transformed response (raw data)
interface CustomAxiosInstance {
  get<T>(url: string, config?: any): Promise<T>;
  post<T>(url: string, data?: any, config?: any): Promise<T>;
  put<T>(url: string, data?: any, config?: any): Promise<T>;
  patch<T>(url: string, data?: any, config?: any): Promise<T>;
  delete<T>(url: string, config?: any): Promise<T>;
  defaults: {
    baseURL: string;
    headers: any;
  };
  interceptors: {
    request: {
      use: (onFulfilled: (config: any) => any, onRejected: (error: any) => any) => void;
    };
    response: {
      use: (onFulfilled: (response: AxiosResponse) => any, onRejected: (error: any) => any) => void;
    };
  };
}

// Create axios instance with custom type
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
}) as CustomAxiosInstance;

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  async (config) => {
    try {
      console.log('api.ts: Base URL:', api.defaults.baseURL);
      console.log('api.ts: Making request to:', config.url);
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
        console.log('api.ts: Token added to request');
      } else {
        console.log('api.ts: No user logged in, proceeding without token');
      }
      
      return config;
    } catch (error) {
      console.error('api.ts: Error getting auth token:', error);
      return config;
    }
  },
  (error) => {
    console.error('api.ts: Request error:', error);
    return Promise.reject(error);
  }
);

// Utility function to transform roadmap objects (_id to id)
const transformRoadmap = (roadmap: any): Roadmap => {
  return {
    ...roadmap,
    id: roadmap._id,
    lastActivity: new Date(roadmap.lastActivity),
    weeks: roadmap.weeks.map((week: any) => ({
      ...week,
      steps: week.steps.map((step: any) => ({
        ...step,
        id: step._id,
      })),
    })),
  };
};

// Utility function to transform template objects (_id to id)
const transformTemplate = (template: any): Template => {
  return {
    ...template,
    _id: template._id,
  };
};

// Add a response interceptor for transforming roadmap data
api.interceptors.response.use(
  (response) => {
    console.log('api.ts: Response received:', response.data);
    // Transform roadmaps in responses
    if (response.config.url?.includes('/roadmaps')) {
      if (response.data.roadmaps) {
        // For getUserRoadmaps
        response.data.roadmaps = response.data.roadmaps.map(transformRoadmap);
      } else if (response.data.roadmap) {
        // For getRoadmap, getRoadmapById, createRoadmap, updateRoadmap, updateStepStatus
        response.data.roadmap = transformRoadmap(response.data.roadmap);
      }
    }
    // Transform templates in responses
    if (response.config.url?.includes('/roadmaps/templates')) {
      if (response.data.templates) {
        // For getTemplates
        response.data.templates = response.data.templates.map(transformTemplate);
      } else if (response.data.template) {
        // For getTemplateBySkill
        response.data.template = transformTemplate(response.data.template);
      }
    }
    return response.data;
  },
  (error) => {
    console.error('api.ts: Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service functions
export const authAPI = {
  register: async (): Promise<void> => {
    const response = await api.post<void>('/auth/register');
    return response;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response;
  },
};

export const profileAPI = {
  updateProfile: async (profileData: UserProfile): Promise<User> => {
    const response = await api.put<User>('/users/profile', profileData);
    return response;
  },
  
  getGamification: async (): Promise<GamificationResponse> => {
    const response = await api.get<GamificationResponse>('/users/gamification');
    return response;
  },
  
  updateXP: async (amount: number): Promise<UpdateXPResponse> => {
    const response = await api.patch<UpdateXPResponse>('/users/xp', { amount });
    return response;
  },
};

export const roadmapAPI = {
  getTemplates: async (): Promise<TemplatesResponse> => {
    const response = await api.get<TemplatesResponse>('/roadmaps/templates');
    return response;
  },
  
  getTemplateBySkill: async (skill: string): Promise<TemplateResponse> => {
    const response = await api.get<TemplateResponse>(`/roadmaps/templates/${skill}`);
    return response;
  },
  
  createRoadmap: async (skill: string): Promise<RoadmapResponse> => {
    const response = await api.post<RoadmapResponse>('/roadmaps', { skill });
    return response;
  },
  
  getUserRoadmaps: async (): Promise<RoadmapsResponse> => {
    const response = await api.get<RoadmapsResponse>('/roadmaps/user');
    return response;
  },
  
  getRoadmap: async (id: string): Promise<RoadmapResponse> => {
    console.log('api.ts: Fetching roadmap with id:', id);
    const response = await api.get<RoadmapResponse>(`/roadmaps/${id}`);
    return response;
  },
  
  getRoadmapById: async (id: string): Promise<RoadmapResponse> => {
    console.log('api.ts: Fetching roadmap by id:', id);
    const response = await api.get<RoadmapResponse>(`/roadmaps/${id}`);
    return response;
  },
  
  updateRoadmap: async (roadmapId: string, updates: Partial<Roadmap>): Promise<RoadmapResponse> => {
    const response = await api.put<RoadmapResponse>(`/roadmaps/${roadmapId}`, updates);
    return response;
  },
  
  deleteRoadmap: async (roadmapId: string): Promise<void> => {
    const response = await api.delete<void>(`/roadmaps/${roadmapId}`);
    return response;
  },
  
  updateStepStatus: async (roadmapId: string, stepId: string, status: string): Promise<RoadmapResponse> => {
    const response = await api.patch<RoadmapResponse>(`/roadmaps/${roadmapId}/steps/${stepId}`, { status });
    return response;
  },
};

export const resourceAPI = {
  getResourcesByStep: async (stepId: string): Promise<ResourcesResponse> => {
    const response = await api.get<ResourcesResponse>(`/resources/step/${stepId}`);
    return response;
  },
};

export const discussionAPI = {
  getDiscussionsByRoadmap: async (roadmapId: string): Promise<DiscussionsResponse> => {
    const response = await api.get<DiscussionsResponse>(`/discussions/roadmap/${roadmapId}`);
    return response;
  },
  
  createDiscussion: async (roadmapId: string, content: string): Promise<DiscussionResponse> => {
    const response = await api.post<DiscussionResponse>(`/discussions/roadmap/${roadmapId}`, { content });
    return response;
  },
  
  addReply: async (discussionId: string, content: string): Promise<ReplyResponse> => {
    const response = await api.post<ReplyResponse>(`/discussions/${discussionId}/replies`, { content });
    return response;
  },
};

export default api;