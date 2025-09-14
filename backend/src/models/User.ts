import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  university?: string;
  major?: string;
  wellnessData: IWellnessData[];
  resources: string[];
  rewards: IReward[];
  smartwatchConnections: ISmartwatchConnection[];
  preferences: IUserPreferences;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IWellnessData {
  date: Date;
  steps: number;
  heartRate: number;
  sleepHours: number;
  studyHours: number;
  stressLevel: number; // 1-10 scale
  mood: 'excellent' | 'good' | 'okay' | 'poor' | 'terrible';
  diet: {
    meals: number;
    waterIntake: number; // in liters
    junkFood: boolean;
  };
  activity: {
    exercise: boolean;
    exerciseType?: string;
    exerciseDuration?: number; // in minutes
  };
  notes?: string;
}

export interface IReward {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  category: 'streak' | 'achievement' | 'milestone';
}

export interface ISmartwatchConnection {
  provider: 'fitbit' | 'google-fit' | 'apple-health';
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  lastSync: Date;
  isActive: boolean;
}

export interface IUserPreferences {
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

const wellnessDataSchema = new Schema<IWellnessData>({
  date: { type: Date, required: true, default: Date.now },
  steps: { type: Number, default: 0, min: 0 },
  heartRate: { type: Number, min: 30, max: 220 },
  sleepHours: { type: Number, min: 0, max: 24 },
  studyHours: { type: Number, min: 0, max: 24 },
  stressLevel: { type: Number, min: 1, max: 10 },
  mood: { 
    type: String, 
    enum: ['excellent', 'good', 'okay', 'poor', 'terrible'],
    default: 'okay'
  },
  diet: {
    meals: { type: Number, min: 0, max: 10, default: 3 },
    waterIntake: { type: Number, min: 0, max: 10, default: 2 },
    junkFood: { type: Boolean, default: false }
  },
  activity: {
    exercise: { type: Boolean, default: false },
    exerciseType: { type: String },
    exerciseDuration: { type: Number, min: 0 }
  },
  notes: { type: String, maxlength: 500 }
}, { _id: false });

const rewardSchema = new Schema<IReward>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  earnedAt: { type: Date, required: true, default: Date.now },
  category: { 
    type: String, 
    enum: ['streak', 'achievement', 'milestone'],
    required: true 
  }
}, { _id: false });

const smartwatchConnectionSchema = new Schema<ISmartwatchConnection>({
  provider: { 
    type: String, 
    enum: ['fitbit', 'google-fit', 'apple-health'],
    required: true 
  },
  accessToken: { type: String, required: true },
  refreshToken: { type: String },
  expiresAt: { type: Date },
  lastSync: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { _id: false });

const userPreferencesSchema = new Schema<IUserPreferences>({
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    reminders: { type: Boolean, default: true }
  },
  privacy: {
    shareData: { type: Boolean, default: false },
    anonymousMode: { type: Boolean, default: false }
  },
  goals: {
    dailySteps: { type: Number, default: 10000 },
    sleepHours: { type: Number, default: 8 },
    studyHours: { type: Number, default: 6 },
    waterIntake: { type: Number, default: 2.5 }
  }
}, { _id: false });

const userSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  avatar: { type: String },
  dateOfBirth: { type: Date },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'other'] 
  },
  university: { type: String, trim: true },
  major: { type: String, trim: true },
  wellnessData: [wellnessDataSchema],
  resources: [{ type: String }],
  rewards: [rewardSchema],
  smartwatchConnections: [smartwatchConnectionSchema],
  preferences: { type: userPreferencesSchema, default: () => ({}) }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ 'wellnessData.date': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual for user's current streak
userSchema.virtual('currentStreak').get(function() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  let streak = 0;
  let currentDate = new Date(today);
  
  // Check if user has data for today
  const hasTodayData = this.wellnessData.some((data: IWellnessData) => 
    data.date.toDateString() === today.toDateString()
  );
  
  if (hasTodayData) {
    streak = 1;
    currentDate = new Date(yesterday);
  }
  
  // Count consecutive days with data
  while (true) {
    const hasDataForDate = this.wellnessData.some((data: IWellnessData) => 
      data.date.toDateString() === currentDate.toDateString()
    );
    
    if (hasDataForDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
});

export default mongoose.model<IUser>('User', userSchema);
