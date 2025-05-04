import { create } from 'zustand';
import { roadmapAPI } from '../services/api';

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

interface Template {
  _id: string;
  skill: string;
  title: string;
  category: string;
  totalWeeks: number;
  weeks: Week[];
  imageUrl?: string;
}

interface RoadmapState {
  userRoadmaps: Roadmap[];
  availableTemplates: Template[];
  template: Template | null;
  currentRoadmap: Roadmap | null;
  isLoading: boolean;
  error: string | null;
  fetchTemplates: () => Promise<void>;
  fetchTemplate: (skill: string) => Promise<void>;
  fetchRoadmaps: () => Promise<void>;
  createRoadmap: (skill: string) => Promise<string>;
  updateRoadmap: (roadmapId: string, updates: Partial<Roadmap>) => Promise<void>;
  deleteRoadmap: (roadmapId: string) => Promise<void>;
  fetchRoadmap: (id: string) => Promise<void>;
  toggleWeekExpansion: (weekId: string) => void;
  updateStepStatus: (roadmapId: string, stepId: string, status: 'not_started' | 'in_progress' | 'completed') => Promise<void>;
}

export const useRoadmapStore = create<RoadmapState>((set, get) => ({
  userRoadmaps: [],
  availableTemplates: [],
  template: null,
  currentRoadmap: null,
  isLoading: false,
  error: null,

  fetchTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('useRoadmapStore: Fetching all templates');
      const response = await roadmapAPI.getTemplates();
      console.log('useRoadmapStore: Templates response:', response);
      set({ availableTemplates: response.templates, isLoading: false });
    } catch (err: any) {
      console.error('useRoadmapStore: Error fetching templates:', err.response?.data || err.message);
      set({ error: 'Failed to fetch templates: ' + (err.response?.data?.error || err.message), isLoading: false });
    }
  },

  fetchTemplate: async (skill: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('useRoadmapStore: Fetching template for skill:', skill);
      const response = await roadmapAPI.getTemplateBySkill(skill);
      console.log('useRoadmapStore: Template response:', response);
      set({ template: response.template, isLoading: false });
    } catch (err: any) {
      console.error('useRoadmapStore: Error fetching template:', err.response?.data || err.message);
      set({ error: 'Failed to fetch template: ' + (err.response?.data?.error || err.message), isLoading: false });
    }
  },

  fetchRoadmaps: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('useRoadmapStore: Fetching user roadmaps');
      const response = await roadmapAPI.getUserRoadmaps();
      console.log('useRoadmapStore: User roadmaps response:', response);
      console.log('useRoadmapStore: Roadmap IDs:', response.roadmaps.map((r: Roadmap) => r.id));
      const validRoadmaps = response.roadmaps.filter((r: Roadmap) => r.id && r.id !== 'undefined');
      if (validRoadmaps.length !== response.roadmaps.length) {
        console.warn('useRoadmapStore: Filtered out roadmaps with invalid IDs:', response.roadmaps);
      }
      set({ userRoadmaps: validRoadmaps, isLoading: false });
    } catch (err: any) {
      console.error('useRoadmapStore: Error fetching roadmaps:', err.response?.data || err.message);
      set({ error: 'Failed to fetch roadmaps: ' + (err.response?.data?.error || err.message), isLoading: false });
    }
  },

  createRoadmap: async (skill: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('useRoadmapStore: Creating roadmap for skill:', skill);
      const response = await roadmapAPI.createRoadmap(skill);
      console.log('useRoadmapStore: Roadmap created:', response);
      const roadmap = response.roadmap;
      
      set((state) => ({
        userRoadmaps: [...state.userRoadmaps, roadmap],
        isLoading: false,
      }));

      return roadmap.id;
    } catch (err: any) {
      console.error('useRoadmapStore: Error creating roadmap:', err.response?.data || err.message);
      set({ error: 'Failed to create roadmap: ' + (err.response?.data?.error || err.message), isLoading: false });
      throw err;
    }
  },

  updateRoadmap: async (roadmapId: string, updates: Partial<Roadmap>) => {
    if (!roadmapId || roadmapId === 'undefined') {
      console.error('useRoadmapStore: Invalid roadmapId for update:', roadmapId);
      set({ error: 'Cannot update roadmap: Invalid roadmap ID', isLoading: false });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      console.log('useRoadmapStore: Updating roadmap:', roadmapId);
      const response = await roadmapAPI.updateRoadmap(roadmapId, updates);
      console.log('useRoadmapStore: Roadmap updated:', response);
      set((state) => ({
        userRoadmaps: state.userRoadmaps.map((roadmap) =>
          roadmap.id === roadmapId ? { ...roadmap, ...updates } : roadmap
        ),
        currentRoadmap:
          state.currentRoadmap?.id === roadmapId
            ? { ...state.currentRoadmap, ...updates }
            : state.currentRoadmap,
        isLoading: false,
      }));
    } catch (err: any) {
      console.error('useRoadmapStore: Error updating roadmap:', err.response?.data || err.message);
      set({ error: 'Failed to update roadmap: ' + (err.response?.data?.error || err.message), isLoading: false });
      throw err;
    }
  },

  deleteRoadmap: async (roadmapId: string) => {
    if (!roadmapId || roadmapId === 'undefined') {
      console.error('useRoadmapStore: Invalid roadmapId for delete:', roadmapId);
      set({ error: 'Cannot delete roadmap: Invalid roadmap ID', isLoading: false });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      console.log('useRoadmapStore: Deleting roadmap:', roadmapId);
      await roadmapAPI.deleteRoadmap(roadmapId);
      set((state) => ({
        userRoadmaps: state.userRoadmaps.filter((roadmap) => roadmap.id !== roadmapId),
        currentRoadmap:
          state.currentRoadmap?.id === roadmapId ? null : state.currentRoadmap,
        isLoading: false,
      }));
    } catch (err: any) {
      console.error('useRoadmapStore: Error deleting roadmap:', err.response?.data || err.message);
      set({ error: 'Failed to delete roadmap: ' + (err.response?.data?.error || err.message), isLoading: false });
      throw err;
    }
  },

  fetchRoadmap: async (id: string) => {
    if (!id || id === 'undefined') {
      console.error('useRoadmapStore: Invalid roadmap ID:', id);
      set({ error: 'Cannot fetch roadmap: Invalid roadmap ID', isLoading: false, currentRoadmap: null });
      return;
    }
    set({ isLoading: true, error: null, currentRoadmap: null }); // Clear currentRoadmap on new fetch
    try {
      console.log('useRoadmapStore: Fetching roadmap with id:', id);
      const response = await roadmapAPI.getRoadmapById(id);
      console.log('useRoadmapStore: Roadmap response:', response);
      // Validate the roadmap ID in the response
      if (!response.roadmap?.id || response.roadmap.id === 'undefined') {
        console.error('useRoadmapStore: Roadmap has invalid ID:', response.roadmap);
        set({ error: 'Cannot fetch roadmap: Roadmap has invalid ID', isLoading: false, currentRoadmap: null });
        return;
      }
      set({ currentRoadmap: response.roadmap, isLoading: false });
    } catch (err: any) {
      console.error('useRoadmapStore: Error fetching roadmap:', err.response?.data || err.message);
      set({ error: 'Failed to fetch roadmap: ' + (err.response?.data?.error || err.message), isLoading: false, currentRoadmap: null });
    }
  },

  toggleWeekExpansion: (weekId: string) => {
    set((state) => {
      if (!state.currentRoadmap) return state;
      return {
        currentRoadmap: {
          ...state.currentRoadmap,
          weeks: state.currentRoadmap.weeks.map((week) =>
            week.id === weekId ? { ...week, isExpanded: !week.isExpanded } : week
          ),
        },
      };
    });
  },

  updateStepStatus: async (roadmapId: string, stepId: string, status: 'not_started' | 'in_progress' | 'completed') => {
    if (!roadmapId || roadmapId === 'undefined') {
      console.error('useRoadmapStore: Invalid roadmapId:', roadmapId);
      set({ error: 'Cannot update step: Invalid roadmap ID', isLoading: false });
      return;
    }
  
    set({ isLoading: true, error: null });
    try {
      console.log('useRoadmapStore: Updating step status:', { roadmapId, stepId, status });
      const response = await roadmapAPI.updateStepStatus(roadmapId, stepId, status);
      console.log('useRoadmapStore: Step status updated:', JSON.stringify(response, null, 2));
      if (!response.roadmap?.weeks) {
        console.error('useRoadmapStore: Response roadmap missing weeks:', response.roadmap);
        set({ error: 'Cannot update step: Response missing weeks data', isLoading: false });
        return;
      }
      set({ currentRoadmap: response.roadmap, isLoading: false });
    } catch (err: any) {
      console.error('useRoadmapStore: Error updating step status:', err.response?.data || err.message);
      set({ error: 'Failed to update step status: ' + (err.response?.data?.error || err.message), isLoading: false });
    }
  },
}));