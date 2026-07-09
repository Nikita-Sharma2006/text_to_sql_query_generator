import QueryHistory from '../models/QueryHistory.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * @desc    Get all query history for current user
 * @route   GET /api/history
 * @access  Private
 */
export const getHistory = async (req, res, next) => {
  try {
    // strict multi-user data isolation: filter by userId
    const history = await QueryHistory.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    return sendSuccess(res, history);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a specific history log record
 * @route   DELETE /api/history/:id
 * @access  Private
 */
export const deleteHistoryRecord = async (req, res, next) => {
  try {
    // ensure user owns the record to delete
    const record = await QueryHistory.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!record) {
      return sendError(res, 'History record not found or access denied.', 404);
    }

    return sendSuccess(res, { message: 'History record successfully destroyed.' });
  } catch (error) {
    next(error);
  }
};
