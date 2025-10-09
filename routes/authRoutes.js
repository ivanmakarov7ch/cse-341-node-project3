// routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Start Google OAuth login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    try {
      // Create a JWT for the logged-in user
      const token = jwt.sign(
        { id: req.user._id, username: req.user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Redirect to oauth-success.html with token in query
      res.redirect(`${process.env.BASE_URL}/oauth-success.html?token=${token}`);
    } catch (err) {
      console.error(err);
      res.redirect('/'); // fallback
    }
  }
);

module.exports = router;
