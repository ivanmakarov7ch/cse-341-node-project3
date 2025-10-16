const express = require('express');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController'); 

const { ensureAuth } = require('../middleware/authMiddleware'); 

const router = express.Router();


router.get('/', ensureAuth, getAllUsers);
router.get('/:id', ensureAuth, getUserById);
router.put('/:id', ensureAuth, updateUser);
router.delete('/:id', ensureAuth, deleteUser);


router.post('/', createUser);

module.exports = router;
