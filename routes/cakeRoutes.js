const express = require('express');
const Cake = require('../models/cake');
const router = express.Router();
const { cakeValidationRules, validate } = require('../validators/cakeValidator');
const { ensureAuth } = require('../middleware/authMiddleware'); // ✅ imported only

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

// Create a new cake (protected + validated)
router.post('/', ensureAuth, cakeValidationRules, validate, async (req, res) => {
  const cake = new Cake(req.body);
  await cake.save();
  res.status(201).json(cake);
});

// Update a cake (protected + validated)
router.put('/:id', ensureAuth, cakeValidationRules, validate, async (req, res) => {
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
