import express from 'express';
import { getHistory, deleteHistoryRecord } from '../controllers/historyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { apiLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// Apply auth lock and rate limit
router.use(protect);
router.use(apiLimiter);

router.get('/', getHistory);
router.delete('/:id', deleteHistoryRecord);

export default router;
