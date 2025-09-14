import { Router } from 'express';
import {
  connectFitbit,
  connectGoogleFit,
  syncWatchData,
  getConnectionStatus,
  disconnectWatch
} from '../controllers/watchController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Smartwatch connection routes
router.post('/connect/fitbit', connectFitbit);
router.post('/connect/google-fit', connectGoogleFit);
router.get('/status', getConnectionStatus);
router.post('/disconnect', disconnectWatch);

// Data sync routes
router.post('/sync', syncWatchData);

export default router;
