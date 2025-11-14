import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Session from '../models/Session.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Create session (trainer only)
router.post('/', authenticate, authorize(['trainer']), async (req, res) => {
  try {
    const { title, description, bookingIds, duration, maxStudents, language, level, scheduledDate } = req.body;

    // Generate unique Jitsi room name
    const jitsiRoomName = `language-session-${uuidv4()}`;
    const jitsiLink = `https://meet.jit.si/${jitsiRoomName}`;

    // Get bookings and extract students
    const bookings = await Booking.find({
      _id: { $in: bookingIds },
      trainer: req.user._id,
      paymentStatus: 'completed'
    });

    if (bookings.length === 0) {
      return res.status(400).json({ message: 'No valid bookings found' });
    }

    const studentIds = bookings.map(booking => booking.student);

    const session = new Session({
      trainer: req.user._id,
      students: studentIds,
      bookings: bookingIds,
      title,
      description,
      jitsiLink,
      jitsiRoomName,
      duration,
      maxStudents,
      language,
      level,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date()
    });

    await session.save();
    await session.populate(['trainer', 'students', 'bookings']);

    // Update bookings with session reference
    await Booking.updateMany(
      { _id: { $in: bookingIds } },
      { sessionId: session._id }
    );

    // Update trainer stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.totalSessions': 1 }
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get sessions for user
router.get('/my-sessions', authenticate, async (req, res) => {
  try {
    let query;
    if (req.user.role === 'trainer') {
      query = { trainer: req.user._id };
    } else {
      query = { students: req.user._id };
    }

    const sessions = await Session.find(query)
      .populate('trainer', 'name email profile')
      .populate('students', 'name email')
      .populate('bookings')
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get session by id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('trainer', 'name email profile')
      .populate('students', 'name email')
      .populate('bookings');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user has access to this session
    const hasAccess = session.trainer._id.toString() === req.user._id.toString() || session.students.some(student => student._id.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update session status
router.put('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;

    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate(['trainer', 'students', 'bookings']);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Update stats when session is completed
    if (status === 'completed') {
      await User.findByIdAndUpdate(session.trainer._id, {
        $inc: { 'stats.completedSessions': 1 }
      });

      // Update booking status to completed
      await Booking.updateMany(
        { sessionId: session._id },
        { status: 'completed' }
      );
    }

    res.json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update session details
router.put('/:id', authenticate, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is the trainer
    if (session.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updates = req.body;
    delete updates.trainer; // Don't allow trainer updates
    delete updates.jitsiLink; // Don't allow jitsi link updates
    delete updates.jitsiRoomName; // Don't allow room name updates

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate(['trainer', 'students', 'bookings']);

    res.json(updatedSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete session
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is the trainer
    if (session.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Remove session reference from bookings
    await Booking.updateMany(
      { sessionId: session._id },
      { $unset: { sessionId: 1 } }
    );

    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;