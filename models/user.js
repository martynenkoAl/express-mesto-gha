const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: [2, 'Имя не может быть короче двух символов'],
      maxlength: [30, 'Имя не может быть длиннее 30-ти символов'],
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: [2, 'Информация не может быть короче двух символов'],
      maxlength: [30, 'Информация не может быть длиннее 30-ти символов'],
    },
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator(v) {
          return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(
            v,
          );
        },
        message: 'Неверный формат URL',
      },
    },
    email: {
      type: String,
      required: [true, 'Необходимо ввести email'],
      unique: true,
      validate: {
        validator(email) {
          validator.isEmail(email);
        },
        message: 'Неверный формат email',
      },
    },
    password: {
      type: String,
      required: [true, 'Необходимо ввести пароль'],
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('Неправильные почта или пароль');
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
