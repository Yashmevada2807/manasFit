import { create } from 'zustand';
import { wellnessAPI, type WellnessData, type WellnessGoal } from '../services/api';
import toast from 'react-hot-toast';

export interface ActivityHeatmapData {
  date: string;
  count: number;
  level: number; // 0-4 for intensity levels
}

export interface WellnessEntry {
  _id: string;
  userId: string;
  date: string;
  steps: number;
  heartRate?: number;
  sleepHours?: number;
  studyHours?: number;
  stressLevel?: number;
  mood: 'excellent' | 'good' | 'okay' | 'poor' | 'terrible';
  diet: {
    meals: number;
    waterIntake: number;
    junkFood: boolean;
  };
  activity: {
    exercise: boolean;
    exerciseType?: string;
    exerciseDuration?: number;
  };
  notes?: string;
  source: 'manual' | 'smartwatch' | 'ai-suggested';
  createdAt: string;
  updatedAt: string;
}

export interface WellnessStats {
  averageSteps: number;
  averageSleep: number;
  averageStudy: number;
  averageStress: number;
  averageWater: number;
  exerciseDays: number;
  moodDistribution: Record<string, number>;
  goalProgress: {
    steps: number;
    sleep: number;
    study: number;
    water: number;
  };
}

export interface WellnessAlert {
  _id: string;
  userId: string;
  type: 'low_steps' | 'poor_sleep' | 'high_stress' | 'missed_study' | 'low_water';
  message: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
  triggeredAt: string;
  data: any;
}

export interface DashboardData {
  period: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  wellnessEntries: WellnessEntry[];
  stats: WellnessStats;
  goals: WellnessGoal[];
  alerts: WellnessAlert[];
  currentStreak: number;
  heatmapData: ActivityHeatmapData[];
  recentRewards: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: string;
    category: 'streak' | 'achievement' | 'milestone';
  }>;
}

interface WellnessState {
  dashboardData: DashboardData | null;
  wellnessHistory: WellnessEntry[];
  goals: WellnessGoal[];
  alerts: WellnessAlert[];
  isLoading: boolean;
  currentPeriod: string;
}

interface WellnessActions {
  addWellnessData: (data: WellnessData) => Promise<void>;
  getDashboardData: (period?: string) => Promise<void>;
  getWellnessHistory: (params?: any) => Promise<void>;
  createGoal: (data: WellnessGoal) => Promise<void>;
  getGoals: () => Promise<void>;
  markAlertRead: (alertId: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setCurrentPeriod: (period: string) => void;
}

type WellnessStore = WellnessState & WellnessActions;

export const useWellnessStore = create<WellnessStore>((set, get) => ({
  // State
  dashboardData: null,
  wellnessHistory: [],
  goals: [],
  alerts: [],
  isLoading: false,
  currentPeriod: '7d',

  // Actions
  addWellnessData: async (data: WellnessData) => {
    set({ isLoading: true });
    try {
      await wellnessAPI.addData(data);
      toast.success('Wellness data added successfully!');
      
      // Refresh dashboard data
      await get().getDashboardData(get().currentPeriod);
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getDashboardData: async (period?: string) => {
    set({ isLoading: true });
    try {
      const response = await wellnessAPI.getDashboard(period || get().currentPeriod);
      const dashboardData = response.data.data;
      
      set({
        dashboardData,
        alerts: dashboardData.alerts,
        currentPeriod: period || get().currentPeriod,
      });
    } catch (error) {
      console.error('Failed to get dashboard data:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getWellnessHistory: async (params?: any) => {
    set({ isLoading: true });
    try {
      const response = await wellnessAPI.getHistory(params);
      const { wellnessEntries } = response.data.data;
      
      set({ wellnessHistory: wellnessEntries });
    } catch (error) {
      console.error('Failed to get wellness history:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  createGoal: async (data: WellnessGoal) => {
    set({ isLoading: true });
    try {
      await wellnessAPI.createGoal(data);
      toast.success('Wellness goal created successfully!');
      
      // Refresh goals
      await get().getGoals();
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getGoals: async () => {
    try {
      const response = await wellnessAPI.getGoals();
      const { goals } = response.data.data;
      
      set({ goals });
    } catch (error) {
      console.error('Failed to get goals:', error);
      throw error;
    }
  },

  markAlertRead: async (alertId: string) => {
    try {
      await wellnessAPI.markAlertRead(alertId);
      
      // Update local state
      set((state) => ({
        alerts: state.alerts.map(alert =>
          alert._id === alertId ? { ...alert, isRead: true } : alert
        ),
      }));
      
      toast.success('Alert marked as read');
    } catch (error) {
      throw error;
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setCurrentPeriod: (period: string) => {
    set({ currentPeriod: period });
  },
}));
