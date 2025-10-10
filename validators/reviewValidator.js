// validators/reviewValidator.js
const { body, validationResult } = require('express-validator');

// ✅ Validation rules for Review
const reviewValidationRules = [
  body('cakeId')
    .notEmpty()
    .withMessage('Cake ID is required')
    .isMongoId()
    .withMessage('Invalid cake ID format'),
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  body('comment')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Comment must be at most 300 characters long'),
];

// ✅ Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  reviewValidationRules,
  validate,
};
