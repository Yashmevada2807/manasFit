import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('Access denied. You do not have permission to perform this action.');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection.');
    } else if (!error.response) {
      toast.error('Network error. Please check your connection.');
    } else {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: RegisterData) => api.post('/auth/register', data),
  login: (data: LoginData) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: UpdateProfileData) => api.put('/auth/profile', data),
  changePassword: (data: ChangePasswordData) => api.put('/auth/change-password', data),
  logout: () => api.post('/auth/logout'),
};

// Wellness API
export const wellnessAPI = {
  addData: (data: WellnessData) => api.post('/wellness/add', data),
  getDashboard: (period?: string) => api.get(`/wellness/dashboard?period=${period || '7d'}`),
  getHistory: (params?: HistoryParams) => api.get('/wellness/history', { params }),
  createGoal: (data: WellnessGoal) => api.post('/wellness/goals', data),
  getGoals: () => api.get('/wellness/goals'),
  markAlertRead: (alertId: string) => api.put(`/wellness/alerts/${alertId}/read`),
};

// AI API
export const aiAPI = {
  chat: (data: ChatData) => api.post('/ai/chat', data),
  getInsights: (period?: string) => api.get(`/ai/insights?period=${period || '7d'}`),
  getRecommendations: (category?: string) => api.get(`/ai/recommendations?category=${category || ''}`),
};

// Smartwatch API
export const watchAPI = {
  connectFitbit: (data: { code: string }) => api.post('/watch/connect/fitbit', data),
  connectGoogleFit: (data: { accessToken: string; refreshToken?: string; expiresIn?: number }) => 
    api.post('/watch/connect/google-fit', data),
  syncData: (data: { provider: string }) => api.post('/watch/sync', data),
  getStatus: () => api.get('/watch/status'),
  disconnect: (data: { provider: string }) => api.post('/watch/disconnect', data),
};

// Resources API
export const resourcesAPI = {
  getAll: (params?: ResourceParams) => api.get('/resources', { params }),
  getById: (id: string) => api.get(`/resources/${id}`),
  getByCategory: (category: string, params?: ResourceParams) => 
    api.get(`/resources/category/${category}`, { params }),
  getFeatured: () => api.get('/resources/featured'),
  getCategories: () => api.get('/resources/categories'),
  save: (data: { resourceId: string }) => api.post('/resources/save', data),
  getSaved: () => api.get('/resources/saved/list'),
};

// Types
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  university?: string;
  major?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  university?: string;
  major?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  preferences?: UserPreferences;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface WellnessData {
  date: string;
  steps?: number;
  heartRate?: number;
  sleepHours?: number;
  studyHours?: number;
  stressLevel?: number;
  mood?: 'excellent' | 'good' | 'okay' | 'poor' | 'terrible';
  diet?: {
    meals?: number;
    waterIntake?: number;
    junkFood?: boolean;
  };
  activity?: {
    exercise?: boolean;
    exerciseType?: string;
    exerciseDuration?: number;
  };
  notes?: string;
  source?: 'manual' | 'smartwatch' | 'ai-suggested';
}

export interface HistoryParams {
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export interface WellnessGoal {
  type: 'steps' | 'sleep' | 'study' | 'water' | 'exercise' | 'stress';
  target: number;
  period: 'daily' | 'weekly' | 'monthly';
  endDate?: string;
}

export interface ChatData {
  message: string;
  context?: string;
}

export interface ResourceParams {
  category?: string;
  type?: string;
  difficulty?: string;
  search?: string;
}

export interface UserPreferences {
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
}

export default api;
