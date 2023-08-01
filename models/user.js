const mongoose = require('mongoose');

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
            v,
          );
        },
        message: 'Неверный формат URL',
      },
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
