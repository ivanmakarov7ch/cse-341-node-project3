const { body, validationResult } = require('express-validator');

// ✅ Validation rules must be a FUNCTION returning an array
const cakeValidationRules = () => [
  body('name').notEmpty().withMessage('Name is required'),
  body('flavor').notEmpty().withMessage('Flavor is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
];

// ✅ Validate middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  res.status(400).json({ errors: errors.array() });
};

module.exports = {
  cakeValidationRules,
  validate,
};
