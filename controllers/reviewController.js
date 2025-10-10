const Review = require('../models/review');

exports.getReviews = async (req, res) => {
  try { const reviews = await Review.find().populate('user', 'username').populate('cake', 'name'); res.json(reviews); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('user', 'username').populate('cake', 'name');
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createReview = async (req, res) => {
  try {
    // user comes from session
    const userId = req.user._id;
    const review = new Review({ user: userId, cake: req.body.cake, rating: req.body.rating, comment: req.body.comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
