import mongoose from 'mongoose';

const schemaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    schemaName: {
      type: String,
      required: [true, 'Schema name is required'],
      trim: true,
    },
    schemaContent: {
      type: String,
      required: [true, 'Schema content is required'],
    },
  },
  {
    timestamps: { createdAt: 'uploadedAt', updatedAt: false },
  }
);

const Schema = mongoose.model('Schema', schemaSchema);

export default Schema;
