const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login-failure' }),
  (req, res) => {
    res.redirect('/'); // user is logged in via session
  }
);

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


function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Login required' });
}

router.post('/', ensureAuth, async (req, res) => {
  const cake = new Cake(req.body);
  await cake.save();
  res.status(201).json(cake);
});

router.put('/:id', ensureAuth, async (req, res) => {
  const cake = await Cake.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!cake) return res.status(404).json({ message: 'Cake not found' });
  res.json(cake);
});
