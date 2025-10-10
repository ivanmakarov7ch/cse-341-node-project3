const express = require('express');
const router = express.Router(); // Must declare this first
const reviewController = require('../controllers/reviewController');
const { body, validationResult } = require('express-validator');
const passport = require('passport'); // to secure routes
const {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

const { reviewValidationRules, validate } = require('../validators/reviewValidator');


/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews
 */
router.get('/', getReviews);
router.get('/:id', getReviewById);
router.post('/', reviewValidationRules, validate, createReview);
router.put('/:id', reviewValidationRules, validate, updateReview);
router.delete('/:id', deleteReview);

// Get all reviews
router.get('/', reviewController.getReviews);

// Get a single review by ID
router.get('/:id', reviewController.getReviewById);

// Create a new review (user must be logged in)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  [
    body('user').isMongoId(),
    body('cake').isMongoId(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().isString()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  reviewController.createReview
);

// Update a review (admin only)
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  reviewController.updateReview
);

// Delete a review (admin only)
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  reviewController.deleteReview
);

module.exports = router;



