const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { body, validationResult } = require('express-validator');
const passport = require('passport');

// ✅ Get all reviews
router.get('/', reviewController.getReviews);

// ✅ Get review by ID
router.get('/:id', reviewController.getReviewById);

// ✅ Create new review (user must be logged in)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  [
    body('user').isMongoId().withMessage('User ID must be valid'),
    body('cake').isMongoId().withMessage('Cake ID must be valid'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').isLength({ min: 3 }).withMessage('Comment must be at least 3 characters')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  reviewController.createReview
);

// ✅ Update review (admin or author)
router.put('/:id', passport.authenticate('jwt', { session: false }), reviewController.updateReview);

// ✅ Delete review (admin or author)
router.delete('/:id', passport.authenticate('jwt', { session: false }), reviewController.deleteReview);

module.exports = router;
