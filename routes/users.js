const router = require('express').Router();

const {
  getUsers,
  getUserById,
  addUser,
  updateUserData,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', addUser);
router.patch('/me', updateUserData);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
