const { body, validationResult } = require('express-validator');

const userValidationRules = () => [
  body('username').notEmpty().withMessage('Username required').isLength({ min: 3 }),
  body('email').isEmail().withMessage('Valid email required')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

module.exports = { userValidationRules, validate };
