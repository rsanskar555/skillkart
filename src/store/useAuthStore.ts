import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  getAuth 
} from 'firebase/auth';
import { authAPI } from '../services/api';

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

interface AuthState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setHasProfile: (value: boolean) => void;
  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isLoading: false,
  error: null,
  initialized: false,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user data from the backend
      const { user } = await authAPI.getCurrentUser();
      
      set({
        currentUser: {
          uid: user.uid,
          email: user.email,
          hasProfile: user.hasProfile || false,
          profile: user.profile
        },
        isLoading: false
      });
    } catch (error) {
      console.error('Login error:', error);
      set({
        error: 'Failed to log in. Please check your credentials.',
        isLoading: false
      });
      throw error;
    }
  },
  
  register: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const auth = getAuth();
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Register user in the backend
      await authAPI.register();
      
      set({
        currentUser: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          hasProfile: false
        },
        isLoading: false
      });
    } catch (error) {
      console.error('Registration error:', error);
      set({
        error: 'Failed to create an account. Please try again.',
        isLoading: false
      });
      throw error;
    }
  },
  
  logout: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const auth = getAuth();
      await signOut(auth);
      
      set({
        currentUser: null,
        isLoading: false
      });
    } catch (error) {
      console.error('Logout error:', error);
      set({
        error: 'Failed to log out.',
        isLoading: false
      });
      throw error;
    }
  },
  
  setHasProfile: (value: boolean) => {
    const { currentUser } = get();
    
    if (currentUser) {
      set({
        currentUser: {
          ...currentUser,
          hasProfile: value
        }
      });
    }
  },
  
  fetchCurrentUser: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const auth = getAuth();
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser) {
        set({
          currentUser: null,
          isLoading: false,
          initialized: true
        });
        return;
      }
      
      try {
        const { user } = await authAPI.getCurrentUser();
        
        set({
          currentUser: {
            uid: user.uid,
            email: user.email,
            hasProfile: user.hasProfile || false,
            profile: user.profile
          },
          isLoading: false,
          initialized: true
        });
      } catch (error) {
        // If backend request fails but we have Firebase user, still consider authenticated
        // but without profile data
        set({
          currentUser: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            hasProfile: false
          },
          isLoading: false,
          initialized: true
        });
      }
    } catch (error) {
      console.error('Fetch current user error:', error);
      set({
        error: 'Failed to fetch current user.',
        isLoading: false,
        initialized: true
      });
    }
  }
}));