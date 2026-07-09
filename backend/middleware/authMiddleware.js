import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendError } from '../utils/responseHelper.js';

export const protect = async (req, res, next) => {
  let token;

  // Read token from authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user and append to request object
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return sendError(res, 'Access denied. Account not found.', 401);
      }

      next();
    } catch (error) {
      console.error(`[Auth Middleware Error] ${error.message}`);
      return sendError(res, 'Access denied. Invalid or expired token.', 401);
    }
  }

  if (!token) {
    return sendError(res, 'Access denied. No authentication token provided.', 401);
  }
};
