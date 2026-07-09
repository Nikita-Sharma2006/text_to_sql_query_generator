import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
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
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;
