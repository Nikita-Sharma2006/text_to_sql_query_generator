import express from 'express';
import { 
  uploadSchema, 
  getSchemas, 
  deleteSchemaRecord 
} from '../controllers/schemaController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSchemaFile } from '../middleware/uploadMiddleware.js';
import { apiLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// Guard routes with token authentication and rate limiting
router.use(protect);
router.use(apiLimiter);

// Upload schema scroll file
router.post('/upload', uploadSchemaFile, uploadSchema);

// Retrieve all user schemas
router.get('/', getSchemas);

// Delete schema scroll
router.delete('/:id', deleteSchemaRecord);

export default router;
