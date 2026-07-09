import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'ai'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  sql: {
    type: String,
    default: null,
  },
  explanation: {
    type: [String],
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const chatSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
      unique: true, // Let's have one continuous session per user for simplicity, or we can support multiple if needed. A single one per user matches "remember the current conversation" perfectly.
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

export default ChatSession;
