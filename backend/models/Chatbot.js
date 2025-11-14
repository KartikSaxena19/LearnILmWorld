import mongoose from 'mongoose';

const chatbotSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.Mixed, // <-- can be ObjectId or string for guests
    ref: 'User'
  },
  userType: {
    type: String,
    enum: ['student', 'trainer', 'admin', 'guest'],
    required: true
  },
  language: {
    type: String,
    enum: ['en', 'de', 'fr', 'ja', 'es', 'sa'],
    default: 'en'
  },
  conversation: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  userContext: {
    userRole: String,
    learningGoal: String,
    targetLanguage: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Chatbot', chatbotSchema);
