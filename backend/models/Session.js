import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],

  title: {
    type: String,
    required: true
  },

  description: String,

  // VIDEO ROOM IDENTIFIER (provider-agnostic)
  roomId: {
    type: String,
    required: true,
    unique: true
  },

  status: {
    type: String,
    enum: ['scheduled', 'active', 'ended', 'cancelled'],
    // changed completed to ended
    default: 'scheduled'
  },

  duration: {
    type: Number,
    default: 60
  },

  maxStudents: {
    type: Number,
    default: 10
  },

  scheduledDate: {
    type: Date,
    default: Date.now
  },

  language: String,

  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  }
}, {
  timestamps: true
});

export default mongoose.model('Session', sessionSchema);
