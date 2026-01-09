import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import Session from '../models/Session.js'
import Booking from '../models/Booking.js'
import User from '../models/User.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { generateToken04 } from '../utils/zegoToken.js'

const router = express.Router()

// Create session (Trainer only)
router.post('/', authenticate, authorize(['trainer']), async (req, res) => {
  try {
    const {
      title,
      description,
      bookingIds,
      duration,
      maxStudents,
      language,
      level,
      scheduledDate
    } = req.body

    const bookings = await Booking.find({
      _id: { $in: bookingIds },
      trainer: req.user._id,
      paymentStatus: 'completed'
    })

    if (!bookings.length) {
      return res.status(400).json({ message: 'No valid bookings found' })
    }

    const studentIds = bookings.map(b => b.student)

    const session = await Session.create({
      trainer: req.user._id,
      students: studentIds,
      bookings: bookingIds,
      title,
      description,
      roomId: `session_${uuidv4()}`, //ZEGO room key
      duration,
      maxStudents,
      language,
      level,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date()
    })

    await Booking.updateMany(
      { _id: { $in: bookingIds } },
      { sessionId: session._id }
    )

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.totalSessions': 1 }
    })

    res.status(201).json(session)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Get sessions for logged-in user
router.get('/my-sessions', authenticate, async (req, res) => {
  try {
    const query =
      req.user.role === 'trainer'
        ? { trainer: req.user._id }
        : { students: req.user._id }

    const sessions = await Session.find(query)
      .populate('trainer', 'name email profile')
      .populate('students', 'name email')
      .populate('bookings')
      .sort({ createdAt: -1 })

    res.json(sessions)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get session by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('trainer', 'name email profile')
      .populate('students', 'name email')
      .populate('bookings')

    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    const allowed =
      session.trainer._id.toString() === req.user._id.toString() ||
      session.students.some(s => s._id.toString() === req.user._id.toString())

    if (!allowed) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.json(session)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ZEGO TOKEN API (core) for JOINING
router.post('/:id/zego-token', authenticate, async (req, res) => {
  try {
    console.log('[ZEGO][TOKEN] Request', {
      sessionId: req.params.id,
      mongoUserId: req.user._id.toString(),
      zegoUserID: `u${req.user._id.toString()}`,
      role: req.user.role,
      time: new Date().toISOString()
    })

    const session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    // ---- Access checks (same as demo)
    const isTrainerOwner =
      session.trainer.toString() === req.user._id.toString()

    const isStudent =
      session.students.some(
        s => s.toString() === req.user._id.toString()
      )

    const isAdmin = req.user.role === 'admin'

    if (!isTrainerOwner && !isStudent && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' })
    }

    // ---- Session state check
    if (!['scheduled', 'active'].includes(session.status)) {
      return res.status(403).json({ message: 'Session not joinable' })
    }

    // ---- Role → privilege mapping
    const canPublish =
      req.user.role === 'trainer' || req.user.role === 'admin'

    console.log('[ZEGO][TOKEN] Access resolved', {
      isTrainerOwner,
      isStudent,
      isAdmin,
      canPublish,
      sessionStatus: session.status
    })


    const payload = JSON.stringify({
      room_id: session.roomId,
      privilege: {
        1: 1,                 // loginRoom
        2: canPublish ? 1 : 0 // publishStream
      },
      stream_id_list: null
    })

    console.log('[ZEGO][TOKEN] Payload summary', {
      roomId: session.roomId,
      privilege: {
        login: 1,
        publish: canPublish ? 1 : 0
      }
    })


    // ---- ZEGO-safe userID (must be consistent)
    const zegoUserID = `u${req.user._id.toString()}`

    const token = generateToken04(
      Number(process.env.ZEGO_APP_ID),
      zegoUserID,
      process.env.ZEGO_SERVER_SECRET,
      600,          // 10 minutes
      payload
    )

    console.log('[ZEGO][TOKEN] Token generated', {
      tokenPrefix: token.slice(0, 4), // should always be "04"
      tokenLength: token.length,
      expiresInSeconds: 3600 //10 min
    })

    console.log('[ZEGO][TOKEN] Token response sent', {
      roomID: session.roomId,
      zegoUserID,
      role: req.user.role
    })


    res.json({
      appID: Number(process.env.ZEGO_APP_ID),
      roomID: session.roomId,
      userID: zegoUserID,
      userName: req.user.name || req.user.email,
      role: req.user.role,
      token
    })

  } catch (err) {
    console.error('[ZEGO][TOKEN] Error', err)
    res.status(500).json({ message: 'ZEGO token generation failed' })
  }
})


// Force end session (Trainer/Admin)
router.put('/:id/end', authenticate, authorize(['trainer', 'admin']), async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    if (
      req.user.role === 'trainer' &&
      session.trainer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' })
    }


    session.status = 'ended'
    await session.save()

    await Booking.updateMany(
      { sessionId: session._id },
      { status: 'completed' }
    )

    await User.findByIdAndUpdate(session.trainer, {
      $inc: { 'stats.completedSessions': 1 }
    })

    res.json({ message: 'Session ended' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// session updation by admin + trainer(owner)
router.put('/:id', authenticate, authorize(['trainer', 'admin']), async (req, res) => {
  const session = await Session.findById(req.params.id)
  if (!session) return res.status(404).json({ message: 'Not found' })

  // Trainer can only edit their own session
  if (
    req.user.role === 'trainer' &&
    session.trainer.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: 'Access denied' })
  }

  if (session.status === 'ended') {
    return res.status(400).json({ message: 'Cannot update ended session' })
  }

  const updates = req.body

  // Hard locks
  delete updates.roomId
  delete updates.trainer
  delete updates.students
  delete updates.bookings
  delete updates.status

  const updated = await Session.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  )

  res.json(updated)
})

// session status updates
router.put('/:id/status', authenticate, authorize(['trainer', 'admin']), async (req, res) => {
  const { status } = req.body
  const ALLOWED = ['scheduled', 'active', 'cancelled']

  const session = await Session.findById(req.params.id)
  if (!session) return res.status(404).json({ message: 'Not found' })

  // cannot regress a session life cycle check
  const transitions = {
    scheduled: ['active', 'cancelled'],
    active: ['cancelled'],
    cancelled: []
  }

  if (!transitions[session.status]?.includes(status)) {
    return res.status(400).json({ message: 'Invalid status transition' })
  }

  if (!ALLOWED.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' })
  }

  if (
    req.user.role === 'trainer' &&
    session.trainer.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: 'Access denied' })
  }

  if (session.status === 'ended') {
    return res.status(400).json({ message: 'Session already ended' })
  }

  session.status = status
  await session.save()

  res.json(session)
})


export default router

