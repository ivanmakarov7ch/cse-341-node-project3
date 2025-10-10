const express = require('express');
const { orderValidationRules, validate } = require('../validators/orderValidator');
const { ensureAuth } = require('../middleware/authMiddleware');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);

router.post('/', ensureAuth, orderValidationRules(), validate, orderController.createOrder);
router.put('/:id', ensureAuth, orderValidationRules(), validate, orderController.updateOrder);
router.delete('/:id', ensureAuth, orderController.deleteOrder);

module.exports = router;
