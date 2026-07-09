import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/responseHelper.js';

// General API rate limiter: max 300 requests per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  handler: (req, res) => {
    return sendError(res, 'Too many requests from this IP. Please try again after 15 minutes.', 429);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication rate limiter: max 30 requests per 15 minutes (to avoid brute-force attacks)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  handler: (req, res) => {
    return sendError(res, 'Brute-force protection: Too many login or register attempts. Try again in 15 minutes.', 429);
  },
  standardHeaders: true,
  legacyHeaders: false,
});
