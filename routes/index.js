const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { addUser, loginUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { UrlRegex } = require('../utils/constants');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(UrlRegex),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  addUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  loginUser,
);

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

module.exports = { router };
