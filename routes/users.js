const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUserData,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateUserData);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
