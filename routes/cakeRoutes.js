const express = require('express');
const router = express.Router();
const Cake = require('../models/cake');
const { cakeValidationRules, validate } = require('../validators/cakeValidator');
const { ensureAuth } = require('../middleware/authMiddleware');

// ✅ GET all cakes
router.get('/', async (req, res) => {
  try {
    const cakes = await Cake.find();
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET a single cake by ID
router.get('/:id', async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) return res.status(404).json({ message: 'Cake not found' });
    res.json(cake);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ CREATE a cake (protected + validated)
router.post('/', ensureAuth, cakeValidationRules(), validate, async (req, res) => {
  try {
    const cake = new Cake(req.body);
    await cake.save();
    res.status(201).json(cake);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ UPDATE a cake (protected + validated)
router.put('/:id', ensureAuth, cakeValidationRules(), validate, async (req, res) => {
  try {
    const cake = await Cake.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cake) return res.status(404).json({ message: 'Cake not found' });
    res.json(cake);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE a cake (protected)
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    const cake = await Cake.findByIdAndDelete(req.params.id);
    if (!cake) return res.status(404).json({ message: 'Cake not found' });
    res.json({ message: 'Cake deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
