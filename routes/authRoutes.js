const express = require('express');
const passport = require('passport');
const router = express.Router();

// GitHub login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub callback
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login-failure' }),
  (req, res) => {
    res.redirect('/'); // redirect to frontend home page
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Get current user
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ id: req.user._id, username: req.user.username });
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});

module.exports = router;
