import { create } from 'zustand';
import { roadmapAPI } from '../services/api';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  resources: Array<{ id: string; title: string; type: string }>;
}

interface Week {
  id: string;
  title: string;
  isCompleted: boolean;
  isExpanded: boolean;
  steps: Step[];
}

interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  totalWeeks: number;
  completedWeeks: number;
  weeks: Week[];
}

interface RoadmapState {
  userRoadmaps: Roadmap[];
  currentRoadmap: Roadmap | null;
  availableTemplates: any[];
  isLoading: boolean;
  error: string | null;
  
  fetchUserRoadmaps: () => Promise<void>;
  fetchRoadmap: (id: string) => Promise<void>;
  fetchTemplates: () => Promise<void>;
  createRoadmap: (skill: string) => Promise<void>;
  updateStepStatus: (
    roadmapId: string,
    stepId: string,
    status: 'not_started' | 'in_progress' | 'completed'
  ) => Promise<void>;
  toggleWeekExpansion: (weekId: string) => void;
}

export const useRoadmapStore = create<RoadmapState>((set, get) => ({
  userRoadmaps: [],
  currentRoadmap: null,
  availableTemplates: [],
  isLoading: false,
  error: null,
  
  fetchUserRoadmaps: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { roadmaps } = await roadmapAPI.getUserRoadmaps();
      
      set({
        userRoadmaps: roadmaps,
        isLoading: false
      });
    } catch (error) {
      console.error('Fetch user roadmaps error:', error);
      set({
        error: 'Failed to fetch your roadmaps. Please try again.',
        isLoading: false
      });
    }
  },
  
  fetchRoadmap: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { roadmap } = await roadmapAPI.getRoadmap(id);
      
      // Initialize isExpanded property for each week
      const processedRoadmap = {
        ...roadmap,
        weeks: roadmap.weeks.map((week: any, index: number) => ({
          ...week,
          isExpanded: index === 0 // Expand first week by default
        }))
      };
      
      set({
        currentRoadmap: processedRoadmap,
        isLoading: false
      });
    } catch (error) {
      console.error('Fetch roadmap error:', error);
      set({
        error: 'Failed to fetch roadmap. Please try again.',
        isLoading: false
      });
    }
  },
  
  fetchTemplates: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { templates } = await roadmapAPI.getTemplates();
      
      set({
        availableTemplates: templates,
        isLoading: false
      });
    } catch (error) {
      console.error('Fetch templates error:', error);
      set({
        error: 'Failed to fetch roadmap templates. Please try again.',
        isLoading: false
      });
    }
  },
  
  createRoadmap: async (skill: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { roadmap } = await roadmapAPI.createRoadmap(skill);
      
      set(state => ({
        userRoadmaps: [...state.userRoadmaps, roadmap],
        isLoading: false
      }));
    } catch (error) {
      console.error('Create roadmap error:', error);
      set({
        error: 'Failed to create roadmap. Please try again.',
        isLoading: false
      });
    }
  },
  
  updateStepStatus: async (
    roadmapId: string,
    stepId: string,
    status: 'not_started' | 'in_progress' | 'completed'
  ) => {
    try {
      const { currentRoadmap } = get();
      
      if (!currentRoadmap) return;
      
      // Optimistically update the UI
      const updatedWeeks = currentRoadmap.weeks.map(week => ({
        ...week,
        steps: week.steps.map(step => 
          step.id === stepId
            ? { ...step, status }
            : step
        )
      }));
      
      // Calculate new progress
      const totalSteps = updatedWeeks.reduce((acc, week) => acc + week.steps.length, 0);
      const completedSteps = updatedWeeks.reduce((acc, week) => {
        return acc + week.steps.filter(step => step.status === 'completed').length;
      }, 0);
      
      const progress = Math.round((completedSteps / totalSteps) * 100);
      
      set({
        currentRoadmap: {
          ...currentRoadmap,
          weeks: updatedWeeks,
          progress
        }
      });
      
      // Make API call to update the status
      const { roadmap, xpUpdate } = await roadmapAPI.updateStepStatus(roadmapId, stepId, status);
      
      // Update with the correct progress from the server
      set(state => ({
        currentRoadmap: state.currentRoadmap ? {
          ...state.currentRoadmap,
          progress: roadmap.progress,
          completedWeeks: roadmap.completedWeeks
        } : null
      }));
      
      // Return XP update to be used by the UI
      return xpUpdate;
    } catch (error) {
      console.error('Update step status error:', error);
      set({
        error: 'Failed to update step status. Please try again.'
      });
    }
  },
  
  toggleWeekExpansion: (weekId: string) => {
    const { currentRoadmap } = get();
    
    if (!currentRoadmap) return;
    
    set({
      currentRoadmap: {
        ...currentRoadmap,
        weeks: currentRoadmap.weeks.map(week => 
          week.id === weekId
            ? { ...week, isExpanded: !week.isExpanded }
            : week
        )
      }
    });
  }
}));