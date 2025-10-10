const { body } = require('express-validator');

function reviewValidationRules() {
  return [
    body('user').notEmpty().withMessage('User ID is required'),
    body('cake').notEmpty().withMessage('Cake ID is required'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be an integer between 1 and 5'),
    body('comment')
      .optional()
      .isString()
      .withMessage('Comment must be a string')
  ];
}

function validate(req, res, next) {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = { reviewValidationRules, validate };
