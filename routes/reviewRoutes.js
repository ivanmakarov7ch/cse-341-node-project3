const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const { reviewValidationRules, validate } = require('../validators/reviewValidator');
const { ensureAuth } = require('../middleware/authMiddleware');

// GET all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'username').populate('cake', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single review by ID
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('user', 'username').populate('cake', 'name');
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a review (protected + validated)
router.post('/', ensureAuth, reviewValidationRules(), validate, async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a review (protected + validated)
router.put('/:id', ensureAuth, reviewValidationRules(), validate, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a review (protected)
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
