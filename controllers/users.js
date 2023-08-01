const User = require("../models/user");
const mongoose = require("mongoose");

const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require("../utils/constants");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send(users))
    .catch(() =>
      res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "На сервере произошла ошибка" })
    );
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      res
        .status(STATUS_NOT_FOUND)
        .send({ message: "Пользователь с таким id не найден" });
    })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        res.status(STATUS_BAD_REQUEST).send({ message: error.message });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CREATED).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(STATUS_BAD_REQUEST).send({ message: error.message });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.updateUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    }
  )
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(STATUS_BAD_REQUEST).send({ message: error.message });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((avatar) => res.send(avatar))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(STATUS_BAD_REQUEST).send({ message: error.message });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "На сервере произошла ошибка" });
      }
    });
};
