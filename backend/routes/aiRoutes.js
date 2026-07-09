import express from 'express';
import { body } from 'express-validator';
import { 
  generateQuery, 
  explainQuery, 
  executeQuery 
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { apiLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// Apply protection and rate-limiting to all AI paths
router.use(protect);
router.use(apiLimiter);

// Generate SQL query
router.post(
  '/generate',
  [
    body('prompt')
      .trim()
      .notEmpty()
      .withMessage('Prompt text is required for generation'),
    validateRequest
  ],
  generateQuery
);

// Explain SQL query
router.post(
  '/explain',
  [
    body('sql')
      .trim()
      .notEmpty()
      .withMessage('SQL command string is required for explanation'),
    validateRequest
  ],
  explainQuery
);

// Simulated Execute SQL query
router.post(
  '/execute',
  [
    body('sql')
      .trim()
      .notEmpty()
      .withMessage('SQL command string is required for execution'),
    validateRequest
  ],
  executeQuery
);

export default router;
