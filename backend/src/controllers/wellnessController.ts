import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { WellnessEntry, WellnessGoal, WellnessAlert } from '../models/Wellness';
import User from '../models/User';

// Add wellness data
export const addWellnessData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const {
      date,
      steps,
      heartRate,
      sleepHours,
      studyHours,
      stressLevel,
      mood,
      diet,
      activity,
      notes,
      source = 'manual'
    } = req.body;

    // Validate required fields
    if (!date) {
      res.status(400).json({
        success: false,
        message: 'Date is required'
      });
      return;
    }

    // Check if entry already exists for this date
    const existingEntry = await WellnessEntry.findOne({
      userId,
      date: new Date(date)
    });

    let wellnessEntry;

    if (existingEntry) {
      // Update existing entry
      if (steps !== undefined) existingEntry.steps = steps;
      if (heartRate !== undefined) existingEntry.heartRate = heartRate;
      if (sleepHours !== undefined) existingEntry.sleepHours = sleepHours;
      if (studyHours !== undefined) existingEntry.studyHours = studyHours;
      if (stressLevel !== undefined) existingEntry.stressLevel = stressLevel;
      if (mood !== undefined) existingEntry.mood = mood;
      if (diet !== undefined) existingEntry.diet = { ...existingEntry.diet, ...diet };
      if (activity !== undefined) existingEntry.activity = { ...existingEntry.activity, ...activity };
      if (notes !== undefined) existingEntry.notes = notes;
      if (source !== undefined) existingEntry.source = source;

      wellnessEntry = await existingEntry.save();
    } else {
      // Create new entry
      wellnessEntry = new WellnessEntry({
        userId,
        date: new Date(date),
        steps: steps || 0,
        heartRate,
        sleepHours,
        studyHours,
        stressLevel,
        mood: mood || 'okay',
        diet: {
          meals: diet?.meals || 3,
          waterIntake: diet?.waterIntake || 2,
          junkFood: diet?.junkFood || false
        },
        activity: {
          exercise: activity?.exercise || false,
          exerciseType: activity?.exerciseType,
          exerciseDuration: activity?.exerciseDuration
        },
        notes,
        source
      });

      await wellnessEntry.save();
    }

    // Check for alerts and generate them
    await checkAndGenerateAlerts(userId, wellnessEntry);

    res.status(200).json({
      success: true,
      message: existingEntry ? 'Wellness data updated successfully' : 'Wellness data added successfully',
      data: { wellnessEntry }
    });
  } catch (error) {
    console.error('Add wellness data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add wellness data',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Get dashboard data
export const getDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { period = '7d' } = req.query;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '1d':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    // Get wellness entries for the period
    const wellnessEntries = await WellnessEntry.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    // Get user goals
    const goals = await WellnessGoal.find({
      userId,
      isActive: true
    });

    // Get recent alerts
    const alerts = await WellnessAlert.find({
      userId,
      isRead: false
    }).sort({ triggeredAt: -1 }).limit(5);

    // Calculate statistics
    const stats = calculateWellnessStats(wellnessEntries, req.user.preferences.goals);

    // Get user's current streak
    const user = await User.findById(userId);
    const currentStreak = user?.currentStreak || 0;

    // Get recent rewards
    const recentRewards = user?.rewards.slice(-5) || [];

    res.status(200).json({
      success: true,
      data: {
        period,
        dateRange: { startDate, endDate },
        wellnessEntries,
        stats,
        goals,
        alerts,
        currentStreak,
        recentRewards
      }
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Get wellness history
export const getWellnessHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, limit = 50 } = req.query;

    const query: any = { userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const wellnessEntries = await WellnessEntry.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit as string));

    res.status(200).json({
      success: true,
      data: { wellnessEntries }
    });
  } catch (error) {
    console.error('Get wellness history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wellness history',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Create wellness goal
export const createWellnessGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { type, target, period, endDate } = req.body;

    if (!type || !target || !period) {
      res.status(400).json({
        success: false,
        message: 'Type, target, and period are required'
      });
      return;
    }

    const goal = new WellnessGoal({
      userId,
      type,
      target,
      period,
      endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });

    await goal.save();

    res.status(201).json({
      success: true,
      message: 'Wellness goal created successfully',
      data: { goal }
    });
  } catch (error) {
    console.error('Create wellness goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create wellness goal',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Get wellness goals
export const getWellnessGoals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { isActive } = req.query;

    const query: any = { userId };
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const goals = await WellnessGoal.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { goals }
    });
  } catch (error) {
    console.error('Get wellness goals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wellness goals',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Mark alert as read
export const markAlertAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { alertId } = req.params;
    const userId = req.user._id;

    const alert = await WellnessAlert.findOneAndUpdate(
      { _id: alertId, userId },
      { isRead: true },
      { new: true }
    );

    if (!alert) {
      res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Alert marked as read',
      data: { alert }
    });
  } catch (error) {
    console.error('Mark alert as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark alert as read',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Helper function to calculate wellness statistics
const calculateWellnessStats = (entries: any[], goals: any) => {
  if (entries.length === 0) {
    return {
      averageSteps: 0,
      averageSleep: 0,
      averageStudy: 0,
      averageStress: 0,
      averageWater: 0,
      exerciseDays: 0,
      moodDistribution: {},
      goalProgress: {}
    };
  }

  const stats = {
    averageSteps: Math.round(entries.reduce((sum, entry) => sum + (entry.steps || 0), 0) / entries.length),
    averageSleep: Math.round((entries.reduce((sum, entry) => sum + (entry.sleepHours || 0), 0) / entries.length) * 10) / 10,
    averageStudy: Math.round((entries.reduce((sum, entry) => sum + (entry.studyHours || 0), 0) / entries.length) * 10) / 10,
    averageStress: Math.round((entries.reduce((sum, entry) => sum + (entry.stressLevel || 5), 0) / entries.length) * 10) / 10,
    averageWater: Math.round((entries.reduce((sum, entry) => sum + (entry.diet?.waterIntake || 0), 0) / entries.length) * 10) / 10,
    exerciseDays: entries.filter(entry => entry.activity?.exercise).length,
    moodDistribution: entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    goalProgress: {
      steps: Math.round((stats.averageSteps / goals.dailySteps) * 100),
      sleep: Math.round((stats.averageSleep / goals.sleepHours) * 100),
      study: Math.round((stats.averageStudy / goals.studyHours) * 100),
      water: Math.round((stats.averageWater / goals.waterIntake) * 100)
    }
  };

  return stats;
};

// Helper function to check and generate alerts
const checkAndGenerateAlerts = async (userId: string, entry: any): Promise<void> => {
  const alerts = [];

  // Check for low steps
  if (entry.steps < 5000) {
    alerts.push({
      userId,
      type: 'low_steps',
      message: `You only took ${entry.steps} steps today. Try to reach at least 5,000 steps for better health!`,
      severity: entry.steps < 2000 ? 'high' : 'medium',
      data: { steps: entry.steps, date: entry.date }
    });
  }

  // Check for poor sleep
  if (entry.sleepHours < 6) {
    alerts.push({
      userId,
      type: 'poor_sleep',
      message: `You only slept ${entry.sleepHours} hours last night. Aim for 7-9 hours for optimal rest!`,
      severity: entry.sleepHours < 4 ? 'high' : 'medium',
      data: { sleepHours: entry.sleepHours, date: entry.date }
    });
  }

  // Check for high stress
  if (entry.stressLevel > 7) {
    alerts.push({
      userId,
      type: 'high_stress',
      message: `Your stress level is ${entry.stressLevel}/10. Consider taking a break or trying relaxation techniques.`,
      severity: entry.stressLevel > 8 ? 'high' : 'medium',
      data: { stressLevel: entry.stressLevel, date: entry.date }
    });
  }

  // Check for low water intake
  if (entry.diet?.waterIntake < 1.5) {
    alerts.push({
      userId,
      type: 'low_water',
      message: `You only drank ${entry.diet.waterIntake}L of water today. Stay hydrated with at least 2L daily!`,
      severity: entry.diet.waterIntake < 1 ? 'high' : 'medium',
      data: { waterIntake: entry.diet.waterIntake, date: entry.date }
    });
  }

  // Check for missed study time
  if (entry.studyHours < 2) {
    alerts.push({
      userId,
      type: 'missed_study',
      message: `You studied for only ${entry.studyHours} hours today. Consider setting aside more time for your studies.`,
      severity: entry.studyHours < 1 ? 'high' : 'low',
      data: { studyHours: entry.studyHours, date: entry.date }
    });
  }

  // Save alerts
  if (alerts.length > 0) {
    await WellnessAlert.insertMany(alerts);
  }
};
