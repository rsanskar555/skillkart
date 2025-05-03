import { create } from 'zustand';
import { profileAPI } from '../services/api';

interface Badge {
  id: string;
  name: string;
  description: string;
  earnedAt: string;
}

interface GamificationState {
  xp: number;
  level: number;
  badges: Badge[];
  streakDays: number;
  lastActivity: string;
  isLoading: boolean;
  error: string | null;
  newBadgeEarned: Badge | null;
  
  fetchGamificationData: () => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  setNewBadgeEarned: (badge: Badge | null) => void;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  xp: 0,
  level: 1,
  badges: [],
  streakDays: 0,
  lastActivity: '',
  isLoading: false,
  error: null,
  newBadgeEarned: null,
  
  fetchGamificationData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await profileAPI.getGamification();
      
      set({
        xp: data.xp,
        level: data.level,
        badges: data.badges,
        streakDays: data.streakDays,
        lastActivity: data.lastActivity,
        isLoading: false
      });
    } catch (error) {
      console.error('Fetch gamification data error:', error);
      set({
        error: 'Failed to fetch gamification data. Please try again.',
        isLoading: false
      });
    }
  },
  
  addXP: async (amount: number) => {
    try {
      const { xp, newBadges } = await profileAPI.updateXP(amount);
      
      // Check if any new badges were earned
      const newBadgeEarned = newBadges && newBadges.length > 0 ? newBadges[0] : null;
      
      // Calculate level based on XP
      const level = Math.floor(xp / 100) + 1;
      
      set(state => ({
        xp,
        level,
        newBadgeEarned,
        badges: newBadgeEarned ? [...state.badges, newBadgeEarned] : state.badges
      }));
    } catch (error) {
      console.error('Add XP error:', error);
      set({
        error: 'Failed to update XP. Please try again.'
      });
    }
  },
  
  setNewBadgeEarned: (badge: Badge | null) => {
    set({ newBadgeEarned: badge });
  }
}));