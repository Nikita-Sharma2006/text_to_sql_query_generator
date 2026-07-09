import multer from 'multer';
import { sendError } from '../utils/responseHelper.js';

// Store uploaded files in memory as buffer (cleaner for database cataloging)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check extension of file
  if (file.originalname.match(/\.(sql)$/i)) {
    cb(null, true);
  } else {
    cb(new Error('Only SQL (.sql) files are accepted!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single('schemaFile');

export const uploadSchemaFile = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading (e.g. file size limit exceeded)
      if (err.code === 'LIMIT_FILE_SIZE') {
        return sendError(res, 'Schema scroll exceeds 5MB size limit.', 400);
      }
      return sendError(res, `Upload error: ${err.message}`, 400);
    } else if (err) {
      // An unknown error occurred (e.g. extension filter failed)
      return sendError(res, err.message, 400);
    }
    
    // Check if file is provided in request
    if (!req.file) {
      return sendError(res, 'Please upload a SQL schema file.', 400);
    }

    next();
  });
};
