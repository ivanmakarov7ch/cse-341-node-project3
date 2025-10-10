const express = require('express');
const router = express.Router();
const Cake = require('../models/cake');
const { cakeValidationRules, validate } = require('../validators/cakeValidator');
const { ensureAuth } = require('../middleware/authMiddleware');

// 🧁 Get all cakes
router.get('/', async (req, res) => {
  try {
    const cakes = await Cake.find();
    res.status(200).json(cakes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cakes', error: error.message });
  }
});

// 🎂 Get a single cake by ID
router.get('/:id', async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) return res.status(404).json({ message: 'Cake not found' });
    res.status(200).json(cake);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cake', error: error.message });
  }
});

// ➕ Create a new cake (protected)
router.post('/', ensureAuth, cakeValidationRules(), validate, async (req, res) => {
  try {
    const cake = new Cake(req.body);
    await cake.save();
    res.status(201).json(cake);
  } catch (error) {
    res.status(400).json({ message: 'Error creating cake', error: error.message });
  }
});

// ✏️ Update a cake (protected)
router.put('/:id', ensureAuth, cakeValidationRules(), validate, async (req, res) => {
  try {
    const cake = await Cake.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cake) return res.status(404).json({ message: 'Cake not found' });
    res.status(200).json(cake);
  } catch (error) {
    res.status(400).json({ message: 'Error updating cake', error: error.message });
  }
});

// ❌ Delete a cake (protected)
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    const cake = await Cake.findByIdAndDelete(req.params.id);
    if (!cake) return res.status(404).json({ message: 'Cake not found' });
    res.status(200).json({ message: 'Cake deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting cake', error: error.message });
  }
});

module.exports = router;
