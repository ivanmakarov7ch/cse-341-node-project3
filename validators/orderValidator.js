const { body, validationResult } = require('express-validator');

const orderValidationRules = () => [
  body('items').isArray({ min: 1 }).withMessage('Items required'),
  body('items.*.cake').isMongoId().withMessage('Invalid cake id in items'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be >= 1'),
  body('totalPrice').isFloat({ min: 0 }).withMessage('Total price must be >= 0')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

module.exports = { orderValidationRules, validate };
