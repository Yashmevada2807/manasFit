import { Response } from 'express';
import axios from 'axios';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import { WellnessEntry } from '../models/Wellness';

// Connect Fitbit
export const connectFitbit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { code } = req.body;

    if (!code) {
      res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
      return;
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://api.fitbit.com/oauth2/token', {
      grant_type: 'authorization_code',
      client_id: process.env.FITBIT_CLIENT_ID,
      client_secret: process.env.FITBIT_CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.FRONTEND_URL}/dashboard`
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`
      }
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Save connection to user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Remove existing Fitbit connection if any
    user.smartwatchConnections = user.smartwatchConnections.filter(
      conn => conn.provider !== 'fitbit'
    );

    // Add new connection
    user.smartwatchConnections.push({
      provider: 'fitbit',
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: new Date(Date.now() + expires_in * 1000),
      lastSync: new Date(),
      isActive: true
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Fitbit connected successfully',
      data: {
        provider: 'fitbit',
        connected: true,
        lastSync: new Date()
      }
    });
  } catch (error) {
    console.error('Fitbit connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect Fitbit',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Connect Google Fit
export const connectGoogleFit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { accessToken, refreshToken, expiresIn } = req.body;

    if (!accessToken) {
      res.status(400).json({
        success: false,
        message: 'Access token is required'
      });
      return;
    }

    // Save connection to user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Remove existing Google Fit connection if any
    user.smartwatchConnections = user.smartwatchConnections.filter(
      conn => conn.provider !== 'google-fit'
    );

    // Add new connection
    user.smartwatchConnections.push({
      provider: 'google-fit',
      accessToken,
      refreshToken,
      expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined,
      lastSync: new Date(),
      isActive: true
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Google Fit connected successfully',
      data: {
        provider: 'google-fit',
        connected: true,
        lastSync: new Date()
      }
    });
  } catch (error) {
    console.error('Google Fit connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect Google Fit',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Sync smartwatch data
export const syncWatchData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { provider } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const connection = user.smartwatchConnections.find(
      conn => conn.provider === provider && conn.isActive
    );

    if (!connection) {
      res.status(404).json({
        success: false,
        message: `${provider} not connected`
      });
      return;
    }

    let syncResult;

    switch (provider) {
      case 'fitbit':
        syncResult = await syncFitbitData(connection, userId);
        break;
      case 'google-fit':
        syncResult = await syncGoogleFitData(connection, userId);
        break;
      default:
        res.status(400).json({
          success: false,
          message: 'Unsupported provider'
        });
        return;
    }

    // Update last sync time
    connection.lastSync = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: `${provider} data synced successfully`,
      data: syncResult
    });
  } catch (error) {
    console.error('Sync watch data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync watch data',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Get connection status
export const getConnectionStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const connections = user.smartwatchConnections.map(conn => ({
      provider: conn.provider,
      isActive: conn.isActive,
      lastSync: conn.lastSync,
      expiresAt: conn.expiresAt
    }));

    res.status(200).json({
      success: true,
      data: { connections }
    });
  } catch (error) {
    console.error('Get connection status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get connection status',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Disconnect smartwatch
export const disconnectWatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { provider } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Remove connection
    user.smartwatchConnections = user.smartwatchConnections.filter(
      conn => conn.provider !== provider
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: `${provider} disconnected successfully`
    });
  } catch (error) {
    console.error('Disconnect watch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect watch',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Helper function to sync Fitbit data
const syncFitbitData = async (connection: any, userId: string): Promise<any> => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateStr = yesterday.toISOString().split('T')[0];

    // Get steps data
    const stepsResponse = await axios.get(
      `https://api.fitbit.com/1/user/-/activities/steps/date/${dateStr}/1d.json`,
      {
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`
        }
      }
    );

    // Get sleep data
    const sleepResponse = await axios.get(
      `https://api.fitbit.com/1.2/user/-/sleep/date/${dateStr}.json`,
      {
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`
        }
      }
    );

    // Get heart rate data
    const heartRateResponse = await axios.get(
      `https://api.fitbit.com/1/user/-/activities/heart/date/${dateStr}/1d.json`,
      {
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`
        }
      }
    );

    const steps = stepsResponse.data['activities-steps'][0]?.value || 0;
    const sleepData = sleepResponse.data.summary;
    const sleepHours = sleepData.totalMinutesAsleep ? sleepData.totalMinutesAsleep / 60 : 0;
    const heartRate = heartRateResponse.data['activities-heart'][0]?.value?.restingHeartRate || null;

    // Save to wellness entry
    const existingEntry = await WellnessEntry.findOne({
      userId,
      date: { $gte: yesterday, $lt: today }
    });

    if (existingEntry) {
      existingEntry.steps = parseInt(steps);
      existingEntry.sleepHours = sleepHours;
      if (heartRate) existingEntry.heartRate = heartRate;
      existingEntry.source = 'smartwatch';
      await existingEntry.save();
    } else {
      const newEntry = new WellnessEntry({
        userId,
        date: yesterday,
        steps: parseInt(steps),
        sleepHours,
        heartRate,
        source: 'smartwatch'
      });
      await newEntry.save();
    }

    return {
      steps: parseInt(steps),
      sleepHours,
      heartRate,
      date: yesterday
    };
  } catch (error) {
    console.error('Fitbit sync error:', error);
    throw new Error('Failed to sync Fitbit data');
  }
};

// Helper function to sync Google Fit data
const syncGoogleFitData = async (connection: any, userId: string): Promise<any> => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const startTime = yesterday.getTime() * 1000000; // Convert to nanoseconds
    const endTime = today.getTime() * 1000000;

    // Get steps data
    const stepsResponse = await axios.get(
      `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
      {
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`
        },
        params: {
          aggregateBy: [{ dataTypeName: 'com.google.step_count.delta' }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTime / 1000000,
          endTimeMillis: endTime / 1000000
        }
      }
    );

    // Get sleep data
    const sleepResponse = await axios.get(
      `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
      {
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`
        },
        params: {
          aggregateBy: [{ dataTypeName: 'com.google.sleep.segment' }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTime / 1000000,
          endTimeMillis: endTime / 1000000
        }
      }
    );

    const steps = stepsResponse.data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
    const sleepData = sleepResponse.data.bucket?.[0]?.dataset?.[0]?.point || [];
    const sleepHours = sleepData.length > 0 ? sleepData.reduce((total: number, point: any) => {
      return total + (point.endTimeNanos - point.startTimeNanos) / (1000000000 * 3600);
    }, 0) : 0;

    // Save to wellness entry
    const existingEntry = await WellnessEntry.findOne({
      userId,
      date: { $gte: yesterday, $lt: today }
    });

    if (existingEntry) {
      existingEntry.steps = steps;
      existingEntry.sleepHours = sleepHours;
      existingEntry.source = 'smartwatch';
      await existingEntry.save();
    } else {
      const newEntry = new WellnessEntry({
        userId,
        date: yesterday,
        steps,
        sleepHours,
        source: 'smartwatch'
      });
      await newEntry.save();
    }

    return {
      steps,
      sleepHours,
      date: yesterday
    };
  } catch (error) {
    console.error('Google Fit sync error:', error);
    throw new Error('Failed to sync Google Fit data');
  }
};
