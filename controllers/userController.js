const User = require('../models/user');

exports.getUsers = async (req, res) => {
  try { const users = await User.find().select('-__v'); res.json(users); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
