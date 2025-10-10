const Order = require('../models/order');

exports.getOrders = async (req, res) => {
  try { const orders = await Order.find().populate('user', 'username').populate('items.cake'); res.json(orders); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'username').populate('items.cake');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const order = new Order({ user: userId, items: req.body.items, totalPrice: req.body.totalPrice });
    await order.save();
    res.status(201).json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
