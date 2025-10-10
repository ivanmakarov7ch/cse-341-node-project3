const { body, validationResult } = require('express-validator');

const reviewValidationRules = () => [
  body('cake').notEmpty().withMessage('Cake ID required').isMongoId().withMessage('Invalid cake ID'),
  body('rating').notEmpty().withMessage('Rating required').isInt({ min: 1, max: 5 }).withMessage('Rating 1-5'),
  body('comment').optional().isString().isLength({ max: 1000 }).withMessage('Comment too long')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

module.exports = { reviewValidationRules, validate };
