const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String }, // optional if using only OAuth
  googleId: { type: String, unique: true, sparse: true }, // only for Google users
});

module.exports = mongoose.model('User', userSchema);
