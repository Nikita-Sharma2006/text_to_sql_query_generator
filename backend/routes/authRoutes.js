import express from 'express';
import { body } from 'express-validator';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  changePassword,
  updateUserProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { authLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// Registration
router.post(
  '/register',
  authLimiter,
  [
    body('fullName')
      .trim()
      .notEmpty()
      .withMessage('Warrior name is required'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Passcode must be at least 6 characters long'),
    validateRequest
  ],
  registerUser
);

// Login
router.post(
  '/login',
  authLimiter,
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Passcode is required'),
    validateRequest
  ],
  loginUser
);

// Get Profile (Protected)
router.get('/profile', protect, getUserProfile);

// Update Profile (Protected)
router.put(
  '/profile',
  protect,
  [
    body('fullName')
      .trim()
      .notEmpty()
      .withMessage('Warrior name is required'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail(),
    validateRequest
  ],
  updateUserProfile
);

// Change Password (Protected)
router.put(
  '/change-password',
  protect,
  [
    body('oldPassword')
      .notEmpty()
      .withMessage('Old passcode is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New passcode must be at least 6 characters long'),
    validateRequest
  ],
  changePassword
);

export default router;
