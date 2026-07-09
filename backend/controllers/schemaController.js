import Schema from '../models/Schema.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * @desc    Upload database structure scroll (.sql schema)
 * @route   POST /api/schema/upload
 * @access  Private
 */
export const uploadSchema = async (req, res, next) => {
  try {
    const schemaContent = req.file.buffer.toString('utf-8');
    const schemaName = req.file.originalname;

    // Check if user has already cataloged a scroll with this name
    let schema = await Schema.findOne({
      userId: req.user._id,
      schemaName,
    });

    if (schema) {
      // Overwrite / Update the content
      schema.schemaContent = schemaContent;
      await schema.save();
      return sendSuccess(res, {
        message: 'Schema scroll updated in Dojo catalog!',
        schema,
      });
    }

    // Create a new schema entry
    schema = await Schema.create({
      userId: req.user._id,
      schemaName,
      schemaContent,
    });

    return sendSuccess(res, {
      message: 'Schema scroll cataloged in Dojo!',
      schema,
    }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all active schemas cataloged by user
 * @route   GET /api/schema
 * @access  Private
 */
export const getSchemas = async (req, res, next) => {
  try {
    const schemas = await Schema.find({ userId: req.user._id })
      .sort({ uploadedAt: -1 });

    return sendSuccess(res, schemas);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Incinerate / Delete a schema scroll
 * @route   DELETE /api/schema/:id
 * @access  Private
 */
export const deleteSchemaRecord = async (req, res, next) => {
  try {
    const schema = await Schema.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!schema) {
      return sendError(res, 'Schema scroll not found or access denied.', 404);
    }

    return sendSuccess(res, { message: 'Schema scroll successfully burned.' });
  } catch (error) {
    next(error);
  }
};
