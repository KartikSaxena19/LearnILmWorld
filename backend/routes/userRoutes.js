import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all trainers
router.get('/trainers', async (req, res) => {
  try {
    const {
      language,
      minRate,
      maxRate,
      experience,
      specialization,
      rating,
      availability,
      search
    } = req.query;

    let query = {
      role: 'trainer',
      isActive: true
    };

    // Apply filters
    if (language) {
      query.$or = [
        { 'profile.languages': { $in: [new RegExp(language, 'i')] } },
        { 'profile.trainerLanguages.language': new RegExp(language, 'i') }
      ];
    }

    if (minRate || maxRate) {
      query['profile.hourlyRate'] = {};
      if (minRate) query['profile.hourlyRate'].$gte = parseFloat(minRate);
      if (maxRate) query['profile.hourlyRate'].$lte = parseFloat(maxRate);
    }

    if (experience) {
      query['profile.experience'] = { $gte: parseInt(experience) };
    }

    if (specialization) {
      query['profile.specializations'] = { $in: [new RegExp(specialization, 'i')] };
    }

    if (rating) {
      query['stats.rating'] = { $gte: parseFloat(rating) };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { 'profile.bio': searchRegex },
        { 'profile.languages': { $in: [searchRegex] } },
        { 'profile.specializations': { $in: [searchRegex] } }
      ];
    }

    let trainersQuery = User.find(query).select('-password');

    // Sort options
    const sortBy = req.query.sortBy || 'rating';
    switch (sortBy) {
      case 'rating':
        trainersQuery = trainersQuery.sort({ 'stats.rating': -1 });
        break;
      case 'price_low':
        trainersQuery = trainersQuery.sort({ 'profile.hourlyRate': 1 });
        break;
      case 'price_high':
        trainersQuery = trainersQuery.sort({ 'profile.hourlyRate': -1 });
        break;
      case 'experience':
        trainersQuery = trainersQuery.sort({ 'profile.experience': -1 });
        break;
      default:
        trainersQuery = trainersQuery.sort({ 'stats.rating': -1 });
    }

    const trainers = await trainersQuery;
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const updates = req.body;

    // forbidden fields
    delete updates.password;
    delete updates.email;
    delete updates.role;

    const existingUser = await User.findById(req.user._id);
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    if (updates.secondaryEmail) {
      const emailInUse = await User.findOne({
        secondaryEmail: updates.secondaryEmail,
        _id: { $ne: existingUser._id }
      });
      if (emailInUse) {
        return res.status(400).json({ message: 'This secondary email is already in use' });
      }
      existingUser.secondaryEmail = updates.secondaryEmail; // update it safely
      delete updates.secondaryEmail; // remove from updates to avoid double-assign
    }

    // MERGE, DON'T REPLACE PROFILE
    if (updates.profile) {
      existingUser.profile = {
        ...existingUser.profile.toObject(),
        ...updates.profile
      };
      delete updates.profile;
    }

    // apply top-level updates
    Object.assign(existingUser, updates);

    const savedUser = await existingUser.save();
    const userToSend = savedUser.toObject();
    delete userToSend.password;

    // console.log("SAFE UPDATED USER:", userToSend);

    res.json(userToSend);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Get dashboard stats
router.get('/stats', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('stats');
    res.json(user.stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;