const express = require('express');
const passport = require('passport');
const router = express.Router();

// start login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// callback
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // redirect to frontend success page or homepage
    res.redirect('/oauth-success.html');
  }
);

// logout
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

// current user
router.get('/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json({ _id: req.user._id, username: req.user.username, email: req.user.email });
  }
  res.status(401).json({ message: 'Not logged in' });
});

module.exports = router;
