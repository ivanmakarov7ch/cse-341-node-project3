const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  flavor: { type: String, required: true }, // <-- add this
  description: String,
  price: { type: Number, required: true },
  category: String,
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cake', cakeSchema);
