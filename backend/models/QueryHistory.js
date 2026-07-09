import mongoose from 'mongoose';

const queryHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    prompt: {
      type: String,
      required: [true, 'Prompt text is required'],
      trim: true,
    },
    generatedSQL: {
      type: String,
      required: [true, 'Generated SQL is required'],
    },
    explanation: {
      type: [String],
      required: [true, 'Explanation text is required'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // only createdAt is needed
  }
);

const QueryHistory = mongoose.model('QueryHistory', queryHistorySchema);

export default QueryHistory;
