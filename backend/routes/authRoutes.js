import express from 'express';
import { sendEmail } from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      profile: {
        education,
        teachingExperienceDetails,
        certifications,
        dob,
        bio,
        resume,
        phone,
        nationalityCode,
      } = {}
    } = req.body;

    // CountDown for Re registration
    const COOLDOWN_MS = 2 * 60 * 1000; // 2 mins for testing, later 6 months ~ 6*30*24*60*60*1000

    let existingUser = await User.findOne({ email });

    if (existingUser) {
      // Trainer re-registration logic
      if (
        existingUser.role === 'trainer' &&
        existingUser.profile.verificationStatus === 'rejected'
      ) {
        const now = new Date();
        const rejectionTime = existingUser.profile.rejectionDate || now;
        if (now - rejectionTime < COOLDOWN_MS) {
          return res.status(400).json({
            message:
              'You can re-register only after the cooldown period. Please wait a few minutes for testing.',
          });
        }

        // Reset trainer data for re-registration (preserve other fields unless provided)
        existingUser.password = password;

        // Basic profile fields
        existingUser.profile.education = education || req.body.profile?.education || existingUser.profile.education || '';
        existingUser.profile.teachingExperienceDetails =
          teachingExperienceDetails || req.body.profile?.teachingExperienceDetails || existingUser.profile.teachingExperienceDetails || '';

        // Certifications — normalize same as new registration
        const incomingCerts = certifications || req.body.profile?.certifications || [];
        existingUser.profile.certifications = Array.isArray(incomingCerts)
          ? incomingCerts.map(cert => ({
            ...cert,
            year: cert.issuedDate ? new Date(cert.issuedDate).getFullYear() : cert.year || null,
            certificateImage: typeof cert.certificateImage === 'string'
              ? cert.certificateImage
              : '',
          }))
          : [];

        // Phone, dob, bio
        existingUser.profile.phone = phone || req.body.profile?.phone || existingUser.profile.phone || '';
        existingUser.profile.dob = req.body.profile?.dob || dob || existingUser.profile.dob || null;
        existingUser.profile.bio = req.body.profile?.bio || bio || existingUser.profile.bio || '';

        // Languages (accept array or CSV string)
        const incomingLanguages = req.body.profile?.languages || req.body.languages || null;
        existingUser.profile.languages = Array.isArray(incomingLanguages)
          ? incomingLanguages
          : typeof incomingLanguages === 'string'
            ? incomingLanguages.split(',').map(l => l.trim()).filter(Boolean)
            : existingUser.profile.languages || [];

        // Specializations / subjects (normalize to array)
        const incomingSubjects = req.body.profile?.subjects || req.body.subjects || null;
        existingUser.profile.specializations = Array.isArray(incomingSubjects)
          ? incomingSubjects
          : typeof incomingSubjects === 'string'
            ? incomingSubjects.split(',').map(s => s.trim()).filter(Boolean)
            : existingUser.profile.specializations || [];

        // Standards (accept array or single string)
        const incomingStandards = req.body.profile?.standards ?? req.body.standards ?? null;
        existingUser.profile.standards = Array.isArray(incomingStandards)
          ? incomingStandards
          : incomingStandards ? [incomingStandards] : existingUser.profile.standards || [];

        // Optional: nationalityCode (ISO2 lowercase) if you add it to frontend
        existingUser.profile.nationalityCode = req.body.profile?.nationalityCode
          || req.body.nationalityCode
          || existingUser.profile.nationalityCode || '';

        // Mark pending & clear rejection time
        existingUser.profile.verificationStatus = 'pending';
        existingUser.profile.rejectionDate = null;

        await existingUser.save();
        sendTrainerVerificationEmail(existingUser, resume);
        return res.status(200).json({
          message: 'You have re-registered successfully. Awaiting verification.',
          user: existingUser,
        });
      } else {
        return res.status(400).json({ message: 'User already exists' });
      }
    }

    // For new User Registration
    const userData = {
      name,
      email,
      password,
      role,
      profile: {}
    };

    //  Use extracted or nested values safely
    // const edu = education || req.body.profile?.education || '';
    // const exp =
    //   teachingExperienceDetails || req.body.profile?.teachingExperienceDetails || '';
    // const certs = certifications || req.body.profile?.certifications || [];

    // Prevent malicious admin creation
    const allowedRoles = ['student', 'trainer'];
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Invalid role' });
    }

    // If trainer, attach verification-related data
    if (role === 'trainer') {
      const {
        education,
        teachingExperienceDetails,
        certifications,
        dob,
        bio,
        resume,
        phone,
        subjects,
        languages,
        standards,
        nationalityCode,
      } = req.body.profile || {};

      userData.profile = {
        education: education || '',

        teachingExperienceDetails:
          req.body.profile?.teachingExperienceDetailsDescription || teachingExperienceDetails || '',
        experience: parseInt(req.body.profile?.experience) || parseInt(teachingExperienceDetails) || 0,

        certifications: Array.isArray(certifications)
          ? certifications.map(cert => ({
            ...cert,
            year: cert.issuedDate ? new Date(cert.issuedDate).getFullYear() : null,
          }))
          : [],
        dob: dob || null,
        bio: bio || '',
        phone: phone || '',
        verificationStatus: 'pending',

        nationalityCode: nationalityCode || req.body.profile?.nationalityCode || '',

        languages: Array.isArray(languages)
          ? languages
          : typeof languages === 'string'
            ? languages.split(',').map(l => l.trim()).filter(Boolean)
            : [],
        specializations: Array.isArray(subjects)
          ? subjects
          : typeof subjects === 'string'
            ? subjects.split(',').map(s => s.trim()).filter(Boolean)
            : [],
        standards: Array.isArray(standards)
          ? standards : standards ? [standards] : [],
      };
    } else if (role === 'student') {
      userData.profile = {
        phone: phone || '',
        learningType: req.body.profile?.learningType || '',
        learningValues: Array.isArray(req.body.profile?.learningValues)
          ? req.body.profile.learningValues
          : req.body.profile?.learningValues
            ? [req.body.profile.learningValues]
            : [],
        standards: Array.isArray(req.body.profile?.standards)
          ? req.body.profile.standards
          : req.body.profile?.standards
            ? [req.body.profile.standards]
            : [],
        specializations: Array.isArray(req.body.profile?.subjects)
          ? req.body.profile.subjects
          : req.body.profile?.subjects
            ? [req.body.profile.subjects]
            : [],
      };
    }

    if (userData.profile?.certifications?.length) {
      userData.profile.certifications = userData.profile.certifications.map(cert => ({
        ...cert,
        certificateImage:
          typeof cert.certificateImage === 'string'
            ? cert.certificateImage
            : '',
      }));
    }

    const user = new User(userData);
    await user.save();

    if (role === 'trainer') {
      // Send verification email with resume attached, but don’t store resume
      // and Send email asynchronously (non-blocking)
      sendTrainerVerificationEmail(user, resume)
        .then(() => console.log('✅ Verification email sent'))
        .catch(err => console.error('❌ Email sending failed:', err));
    }

    // JWT token for immediate use
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: role === 'trainer'
        ? 'Trainer registered successfully. Awaiting verification.'
        : 'User registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Helper to send email to admin for trainer verification
const sendTrainerVerificationEmail = async (user, resumeData) => {
  const { profile } = user;

  // teachingValues snippet (use exactly as instructed)
  const teachingValues =
    (profile.specializations && profile.specializations.length)
      ? profile.specializations
      : profile.languages && profile.languages.length
        ? profile.languages
        : profile.hobbies && profile.hobbies.length
          ? profile.hobbies
          : ['N/A'];

  // Build certification list
  const certList = (profile.certifications || [])
    .map(
      (c, i) => `
      <div style="margin-bottom:10px;">
        <b>${i + 1}. ${c.name || 'N/A'}</b><br>
        <b>Issuer:</b> ${c.issuer || 'N/A'}<br>
        <b>Issued Date:</b> ${c.issuedDate ? new Date(c.issuedDate).toLocaleDateString() : 'N/A'}<br>
        <b>Certificate Link:</b> <a href="${c.certificateLink || '#'}">${c.certificateLink || 'No link'}</a>
      </div>
    `
    )
    .join('') || '<p>No certificates provided</p>';

  // Approve/Reject links
  const verifyToken = jwt.sign({ trainerId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  const approveLink = `${process.env.FRONTEND_URL}/api/auth/verify-trainer/${verifyToken}?action=approve`;
  const rejectLink = `${process.env.FRONTEND_URL}/api/auth/verify-trainer/${verifyToken}?action=reject`;

  const htmlBody = `
    <h2>Trainer Registration - Verification Required</h2>

    <p><b>Name:</b> ${user.name}</p>
    <p><b>Email:</b> ${user.email}</p>
    <p><b>Phone:</b> ${profile.phone || 'N/A'}</p>

    <hr>

    <h3>Trainer Details</h3>
    <p><b>Highest Qualification:</b> ${profile.education || 'N/A'}</p>
    <p><b>Bio:</b> ${profile.bio || 'N/A'}</p>

    <p><b>Teaching Type:</b> ${profile.specializations?.length ? 'Subjects' :
      profile.languages?.length ? 'Languages' :
        profile.hobbies?.length ? 'Hobbies' : 'N/A'
    }</p>

    <p><b>Teaching Values:</b> ${teachingValues.join(', ')}</p>

    <p><b>Experience (Years):</b> ${profile.experience || 0}</p>

    <p><b>Standards:</b> ${Array.isArray(profile.standards) && profile.standards.length
      ? profile.standards.join(', ')
      : 'N/A'
    }</p>

    <p><b>Date of Birth:</b> ${profile.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A'
    }</p>

    <hr>

    <h3>Certifications</h3>
    ${certList}

    <hr>

    <p>Click below to verify or reject this trainer:</p>
    <a href="${approveLink}" style="color:green;">✅ Approve Trainer</a><br>
    <a href="${rejectLink}" style="color:red;">❌ Reject Trainer</a>
  `;

  // Attachments (unchanged)
  const attachments = [];
  if (resumeData && typeof resumeData === 'string' && resumeData.startsWith('data:')) {
    const base64Data = resumeData.split(';base64,').pop();
    attachments.push({
      filename: 'resume.pdf',
      content: base64Data,
      encoding: 'base64'
    });
  }

  // Send email
  await sendEmail({
    to: process.env.ADMIN_VERIFICATION_EMAIL,
    subject: `Trainer Verification Required - ${user.name}`,
    html: htmlBody,
    attachments,
  });
};


// End of helper

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    //for admin
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return res.json({
        token,
        user: {
          id: 'admin_static_id',
          name: 'Super Admin',
          email,
          role: 'admin'
        }
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Block unverified trainers
    if (user.role === 'trainer') {
      if (user.profile.verificationStatus === 'pending') {
        return res.status(403).json({
          message: 'Your account verification is still pending. Please wait until it is approved.'
        });
      }
      if (user.profile.verificationStatus === 'rejected') {
        return res.status(403).json({
          message: 'Your account verification was rejected. You may reapply after 6 months from your previous registration.'
        });
      }
    }


    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    profile: req.user.profile,
    stats: req.user.stats
  });
});



// ---------------- FORGOT PASSWORD ----------------
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No account found with this email' });
    }

    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // token valid for 15 minutes
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const htmlBody = `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password. This link will expire in 15 minutes.</p>
      <a href="${resetLink}" style="color:blue;">Reset Password</a>
      <p>If you didn't request this, ignore this email.</p>
    `;

    await sendEmail({
      to: email,
      subject: 'Password Reset',
      html: htmlBody
    });

    res.json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Something went wrong, try again later.' });
  }
});

// ---------------- RESET PASSWORD ----------------
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successful! You can now log in.' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});


// ---------- VERIFY TRAINER VIA EMAIL LINK ---------------
router.get('/verify-trainer/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { action } = req.query; // approve or reject

    // Decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const trainerId = decoded.trainerId;

    const trainer = await User.findById(trainerId);
    if (!trainer) return res.status(404).send('Trainer not found');

    if (trainer.profile.verificationStatus !== 'pending') {
      return res.status(400).send('Trainer already verified or rejected');
    }

    if (action === 'approve') {
      trainer.profile.verificationStatus = 'verified';
      await trainer.save();

      // Send approval email to trainer
      const htmlBody1 = `
        <h2>Congratulations, ${trainer.name}!</h2>
        <p>Your documents have been verified successfully.</p>
        <p>You can now log in using your registered email and password.</p>
      `;

      await sendEmail({
        to: trainer.email,
        subject: 'Trainer Verification Approved',
        html: htmlBody1
      });

      return res.send(`
        <html>
          <head>
            <title>Trainer Verified</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f0f4f8; }
              .container { background: white; padding: 30px; border-radius: 10px; display: inline-block; }
              h1 { color: green; }
              a { color: #007bff; text-decoration: none; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>✅ Trainer Verified!</h1>
              <p>${trainer.name} has been successfully approved.</p>
            </div>
          </body>
        </html>
      `);
    }

    if (action === 'reject') {
      trainer.profile.verificationStatus = 'rejected';
      trainer.profile.rejectionDate = new Date();
      // set rejection date
      await trainer.save();

      // Send rejection email
      const htmlBody1 = `
        <h2>Hello ${trainer.name},</h2>
        <p>Unfortunately, your trainer verification has been rejected.</p>
        <p>Please review your submitted details and try again after cooldown period of 6 months.</p>
      `;

      await sendEmail({
        to: trainer.email,
        subject: 'Trainer Verification Rejected',
        html: htmlBody1
      });

      return res.send(`
        <html>
          <head>
            <title>Trainer Rejected</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f0f4f8; }
              .container { background: white; padding: 30px; border-radius: 10px; display: inline-block; }
              h1 { color: green; }
              a { color: #007bff; text-decoration: none; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>❌ Trainer Rejected!</h1>
              <p>${trainer.name}  has been successfully rejected and notified..</p>
            </div>
          </body>
        </html>
      `);
    }

    res.status(400).send('Invalid action');
  } catch (error) {
    console.error('Verification link error:', error);
    res.status(400).send('Invalid or expired link');
  }
});

export default router;
