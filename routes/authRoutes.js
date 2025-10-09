const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/oauth-failure.html' }),
  (req, res) => {
    // Create JWT token
    const token = jwt.sign(
      { id: req.user._id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Redirect to your public page with token
    res.redirect(`${process.env.CLIENT_URL}/oauth-success.html?token=${token}`);
  }
);

module.exports = router;
