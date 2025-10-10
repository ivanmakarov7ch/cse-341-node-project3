const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  flavor: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Cake', cakeSchema);
