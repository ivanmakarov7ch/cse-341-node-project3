const express = require('express');
const { reviewValidationRules, validate } = require('../validators/reviewValidator');
const { ensureAuth } = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.get('/', reviewController.getReviews);
router.get('/:id', reviewController.getReviewById);

router.post('/', ensureAuth, reviewValidationRules(), validate, reviewController.createReview);
router.put('/:id', ensureAuth, reviewValidationRules(), validate, reviewController.updateReview);
router.delete('/:id', ensureAuth, reviewController.deleteReview);

module.exports = router;