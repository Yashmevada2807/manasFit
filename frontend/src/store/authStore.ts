import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI, type LoginData, type RegisterData, type UpdateProfileData } from '../services/api';
import toast from 'react-hot-toast';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  university?: string;
  major?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      reminders: boolean;
    };
    privacy: {
      shareData: boolean;
      anonymousMode: boolean;
    };
    goals: {
      dailySteps: number;
      sleepHours: number;
      studyHours: number;
      waterIntake: number;
    };
  };
  currentStreak: number;
  rewards: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: string;
    category: 'streak' | 'achievement' | 'milestone';
  }>;
  smartwatchConnections: Array<{
    provider: 'fitbit' | 'google-fit' | 'apple-health';
    isActive: boolean;
    lastSync: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  refreshProfile: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      login: async (data: LoginData) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.login(data);
          const { user, token } = response.data.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Store token in localStorage for API interceptor
          localStorage.setItem('token', token);
          
          toast.success('Login successful!');
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.register(data);
          const { user, token } = response.data.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Store token in localStorage for API interceptor
          localStorage.setItem('token', token);
          
          toast.success('Registration successful!');
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        toast.success('Logged out successfully');
      },

      updateProfile: async (data: UpdateProfileData) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.updateProfile(data);
          const { user } = response.data.data;
          
          set({
            user,
            isLoading: false,
          });
          
          toast.success('Profile updated successfully!');
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      refreshProfile: async () => {
        try {
          const response = await authAPI.getProfile();
          const { user } = response.data.data;
          
          set({ user });
        } catch (error) {
          console.error('Failed to refresh profile:', error);
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
