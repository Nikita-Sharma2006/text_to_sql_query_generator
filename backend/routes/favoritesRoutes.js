import express from 'express';
import { body } from 'express-validator';
import { 
  getFavorites, 
  addFavorite, 
  deleteFavorite 
} from '../controllers/favoritesController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { apiLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// Apply auth block and rate limit
router.use(protect);
router.use(apiLimiter);

router.get('/', getFavorites);

router.post(
  '/',
  [
    body('prompt')
      .trim()
      .notEmpty()
      .withMessage('Prompt text is required for starring'),
    body('generatedSQL')
      .trim()
      .notEmpty()
      .withMessage('SQL statement is required for starring'),
    validateRequest
  ],
  addFavorite
);

router.delete('/:id', deleteFavorite);

export default router;
