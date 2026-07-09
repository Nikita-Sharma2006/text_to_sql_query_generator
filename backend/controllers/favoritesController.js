import Favorite from '../models/Favorite.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * @desc    Get all favorite queries for current user
 * @route   GET /api/favorites
 * @access  Private
 */
export const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    return sendSuccess(res, favorites);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Star / Add a query to favorites
 * @route   POST /api/favorites
 * @access  Private
 */
export const addFavorite = async (req, res, next) => {
  const { prompt, generatedSQL } = req.body;

  try {
    // Check if query is already bookmarked
    const alreadyFavorited = await Favorite.findOne({
      userId: req.user._id,
      generatedSQL,
    });

    if (alreadyFavorited) {
      return sendError(res, 'This query is already in your favorites scroll list.', 400);
    }

    const favorite = await Favorite.create({
      userId: req.user._id,
      prompt,
      generatedSQL,
    });

    return sendSuccess(res, favorite, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Unstar / Remove a query from favorites
 * @route   DELETE /api/favorites/:id
 * @access  Private
 */
export const deleteFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!favorite) {
      return sendError(res, 'Favorite record not found or access denied.', 404);
    }

    return sendSuccess(res, { message: 'Favorite query successfully unstarred.' });
  } catch (error) {
    next(error);
  }
};
