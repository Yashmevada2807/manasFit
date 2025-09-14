import mongoose, { Document, Schema } from 'mongoose';

export interface IWellnessEntry extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  steps: number;
  heartRate: number;
  sleepHours: number;
  studyHours: number;
  stressLevel: number;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface IWellnessGoal extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'steps' | 'sleep' | 'study' | 'water' | 'exercise' | 'stress';
  target: number;
  current: number;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWellnessAlert extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'low_steps' | 'poor_sleep' | 'high_stress' | 'missed_study' | 'low_water';
  message: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
  triggeredAt: Date;
  data: any;
}

const wellnessEntrySchema = new Schema<IWellnessEntry>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  steps: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  heartRate: { 
    type: Number, 
    min: 30, 
    max: 220 
  },
  sleepHours: { 
    type: Number, 
    min: 0, 
    max: 24 
  },
  studyHours: { 
    type: Number, 
    min: 0, 
    max: 24 
  },
  stressLevel: { 
    type: Number, 
    min: 1, 
    max: 10 
  },
  mood: { 
    type: String, 
    enum: ['excellent', 'good', 'okay', 'poor', 'terrible'],
    default: 'okay'
  },
  diet: {
    meals: { 
      type: Number, 
      min: 0, 
      max: 10, 
      default: 3 
    },
    waterIntake: { 
      type: Number, 
      min: 0, 
      max: 10, 
      default: 2 
    },
    junkFood: { 
      type: Boolean, 
      default: false 
    }
  },
  activity: {
    exercise: { 
      type: Boolean, 
      default: false 
    },
    exerciseType: { 
      type: String 
    },
    exerciseDuration: { 
      type: Number, 
      min: 0 
    }
  },
  notes: { 
    type: String, 
    maxlength: 500 
  },
  source: { 
    type: String, 
    enum: ['manual', 'smartwatch', 'ai-suggested'],
    default: 'manual'
  }
}, {
  timestamps: true
});

const wellnessGoalSchema = new Schema<IWellnessGoal>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['steps', 'sleep', 'study', 'water', 'exercise', 'stress'],
    required: true 
  },
  target: { 
    type: Number, 
    required: true,
    min: 0 
  },
  current: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  period: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  startDate: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

const wellnessAlertSchema = new Schema<IWellnessAlert>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['low_steps', 'poor_sleep', 'high_stress', 'missed_study', 'low_water'],
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  severity: { 
    type: String, 
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  triggeredAt: { 
    type: Date, 
    default: Date.now 
  },
  data: { 
    type: Schema.Types.Mixed 
  }
}, {
  timestamps: true
});

// Indexes for better query performance
wellnessEntrySchema.index({ userId: 1, date: -1 });
wellnessEntrySchema.index({ date: -1 });
wellnessGoalSchema.index({ userId: 1, isActive: 1 });
wellnessAlertSchema.index({ userId: 1, isRead: 1, triggeredAt: -1 });

// Compound index for unique daily entries per user
wellnessEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

export const WellnessEntry = mongoose.model<IWellnessEntry>('WellnessEntry', wellnessEntrySchema);
export const WellnessGoal = mongoose.model<IWellnessGoal>('WellnessGoal', wellnessGoalSchema);
export const WellnessAlert = mongoose.model<IWellnessAlert>('WellnessAlert', wellnessAlertSchema);
