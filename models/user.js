const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле не может быть пустым'],
      minlength: [2, 'Имя не может быть короче двух символов'],
      maxlength: [30, 'Имя не может быть длиннее 30-ти символов'],
    },
    about: {
      type: String,
      required: [true, 'Поле не может быть пустым'],
      minlength: [2, 'Информация не может быть короче двух символов'],
      maxlength: [30, 'Информация не может быть длиннее 30-ти символов'],
    },
    avatar: {
      type: String,
      required: [true, 'Поле не может быть пустым'],
      validate: {
        validator(v) {
          return /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/.test(
            v
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
        validator(v) {
          return /.+@.+\..+/.test(v);
        },
        message: 'Неверный формат email',
      },
    },
    password: {
      type: String,
      required: [true, 'Необходимо ввести пароль'],
      minlength: [6, 'Пароль не может быть короче 6-ти символов'],
      select: false,
    },
  },
  { versionKey: false }
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject(new Error('Неправильные почта или пароль'));
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return user;
    });
  });
};

module.exports = mongoose.model('user', userSchema);
