import { Router } from 'express';
import {
  getAllResources,
  getResourceById,
  getResourcesByCategory,
  getFeaturedResources,
  getResourceCategories,
  saveResource,
  getSavedResources
} from '../controllers/resourceController';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware';

const router = Router();

// Public routes (some with optional auth)
router.get('/', optionalAuth, getAllResources);
router.get('/featured', optionalAuth, getFeaturedResources);
router.get('/categories', optionalAuth, getResourceCategories);
router.get('/category/:category', optionalAuth, getResourcesByCategory);
router.get('/:id', optionalAuth, getResourceById);

// Protected routes
router.post('/save', authenticateToken, saveResource);
router.get('/saved/list', authenticateToken, getSavedResources);

export default router;
