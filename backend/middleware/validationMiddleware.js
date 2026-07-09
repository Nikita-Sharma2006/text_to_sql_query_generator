import { validationResult } from 'express-validator';
import { sendError } from '../utils/responseHelper.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return the first validation error message for clean UI presentation
    return sendError(res, errors.array()[0].msg, 400);
  }
  next();
};
