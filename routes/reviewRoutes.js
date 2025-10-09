const express = require('express');
const router = express.Router();
const orderController = require('../controllers/reviewController');
const { body, validationResult } = require('express-validator');
const passport = require('passport'); // to secure routes

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);

// user must log in
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  [
    body('user').isMongoId(),
    body('items').isArray({ min: 1 }),
    body('items.*.cake').isMongoId(),
    body('items.*.quantity').isInt({ min: 1 }),
    body('totalPrice').isFloat({ min: 0 })
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  orderController.createOrder
);

// For Admin
router.put('/:id', passport.authenticate('jwt', { session: false }), orderController.updateOrder);
router.delete('/:id', passport.authenticate('jwt', { session: false }), orderController.deleteOrder);

module.exports = router;
