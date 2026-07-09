import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token lasts for 30 days
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendError(res, 'A user with this email address already exists.', 400);
    }

    // Create user (password hashing is done in User model hook)
    const user = await User.create({
      fullName,
      email,
      password,
    });

    const token = generateToken(user._id);

    return sendSuccess(res, {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 'Invalid credentials. Check your email or passcode.', 401);
    }

    // Compare passwords
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials. Check your email or passcode.', 401);
    }

    const token = generateToken(user._id);

    return sendSuccess(res, {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user profile details
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    // req.user is populated by protect middleware
    return sendSuccess(res, {
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change user password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 'User record not found.', 404);
    }

    // Check old password
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return sendError(res, 'Your old passcode is incorrect.', 400);
    }

    // Hash new password (handled by model hook if re-saved)
    user.password = newPassword;
    await user.save();

    return sendSuccess(res, { message: 'Passcode successfully re-forged!' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile details
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
  const { fullName, email } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 'User record not found.', 404);
    }

    if (email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return sendError(res, 'A user with this email address already exists.', 400);
      }
    }

    user.fullName = fullName;
    user.email = email;
    await user.save();

    return sendSuccess(res, {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

