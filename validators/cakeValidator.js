const { body, validationResult } = require('express-validator');

exports.cakeValidationRules = [
  body('name').notEmpty().withMessage('Cake name is required'),
  body('flavor').notEmpty().withMessage('Flavor is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('available').isBoolean().withMessage('Available must be true or false')
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
