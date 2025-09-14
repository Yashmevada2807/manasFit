import { Router } from 'express';
import {
  chatWithAI,
  getWellnessInsights,
  getPersonalizedRecommendations
} from '../controllers/aiController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// AI chat routes
router.post('/chat', chatWithAI);
router.get('/insights', getWellnessInsights);
router.get('/recommendations', getPersonalizedRecommendations);

export default router;
