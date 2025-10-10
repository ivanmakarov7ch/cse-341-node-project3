// validators/cakeValidator.js
const { body, validationResult } = require('express-validator');

const cakeValidationRules = () => [
  body('name')
    .notEmpty().withMessage('Name is required'),
  body('flavor')
    .notEmpty().withMessage('Flavor is required'),
  body('price')
    .isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
];

// Middleware to handle validation result
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { cakeValidationRules, validate };
