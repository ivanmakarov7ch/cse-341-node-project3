const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/', ensureAuth, getAllUsers);
router.get('/:id', ensureAuth, getUserById);
router.put('/:id', ensureAuth, updateUser);
router.delete('/:id', ensureAuth, deleteUser);
router.post('/', createUser);
module.exports = router;





// const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
// const ensureAuth = require('../middleware/auth');



// // Protect these routes
// router.get('/', ensureAuth, getAllUsers);
// router.get('/:id', ensureAuth, getUserById);


// // Creating a user (register) is public
// router.post('/', createUser);

// module.exports = router;
