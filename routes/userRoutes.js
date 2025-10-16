const express = require('express');

// Make sure the controller file exists and the functions are exported
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController'); // <-- exact path

// Import your auth middleware
const { ensureAuth } = require('../middleware/authMiddleware'); // <-- exact file name

const router = express.Router();

// Protected routes
router.get('/', ensureAuth, getAllUsers);
router.get('/:id', ensureAuth, getUserById);
router.put('/:id', ensureAuth, updateUser);
router.delete('/:id', ensureAuth, deleteUser);

// Public route
router.post('/', createUser);

module.exports = router;
