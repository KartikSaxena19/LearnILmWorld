import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail:{
    type: String, 
    required: false, 
    trim: true, 
    lowercase: true
  },
  bookingType: {
    type: String,
    enum: ['paid', 'free_demo'],
    default: 'paid', 
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'na'],//na for free demo
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'fake', 'none'], //none for free demo
    required: true
  },
  amount: {
    type: Number,
    required: function(){this.bookingType==='paid'}
  },
  paymentId: String,
  paymentDetails: {
    amount: Number,
    currency: String,
    paymentMethod: String,
    status: String,
    receiptUrl: String,
    processedAt: Date
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  notes: String
}, {
  timestamps: true
});

bookingSchema.index({ studentEmail: 1, bookingType: 1 });
export default mongoose.model('Booking', bookingSchema);