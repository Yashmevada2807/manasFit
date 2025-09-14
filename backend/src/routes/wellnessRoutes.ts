import { Router } from 'express';
import {
  addWellnessData,
  getDashboardData,
  getWellnessHistory,
  createWellnessGoal,
  getWellnessGoals,
  markAlertAsRead
} from '../controllers/wellnessController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Wellness data routes
router.post('/add', addWellnessData);
router.get('/dashboard', getDashboardData);
router.get('/history', getWellnessHistory);

// Goals routes
router.post('/goals', createWellnessGoal);
router.get('/goals', getWellnessGoals);

// Alerts routes
router.put('/alerts/:alertId/read', markAlertAsRead);

export default router;
