const express = require('express');
const Cake = require('../models/cake');
const router = express.Router();

// Middleware to check if user is logged in
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Login required' });
}

// Get all cakes
router.get('/', async (req, res) => {
  const cakes = await Cake.find();
  res.json(cakes);
});

// Get a single cake
router.get('/:id', async (req, res) => {
  const cake = await Cake.findById(req.params.id);
  if (!cake) return res.status(404).json({ message: 'Cake not found' });
  res.json(cake);
});

// Create a new cake (protected)
router.post('/', ensureAuth, async (req, res) => {
  const cake = new Cake(req.body);
  await cake.save();
  res.status(201).json(cake);
});

// Update a cake (protected)
router.put('/:id', ensureAuth, async (req, res) => {
  const cake = await Cake.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!cake) return res.status(404).json({ message: 'Cake not found' });
  res.json(cake);
});

// Delete a cake (protected)
router.delete('/:id', ensureAuth, async (req, res) => {
  const cake = await Cake.findByIdAndDelete(req.params.id);
  if (!cake) return res.status(404).json({ message: 'Cake not found' });
  res.json({ message: 'Cake deleted' });
});

module.exports = router;
