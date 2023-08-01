const User = require("../models/user");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError("Пользователь с таким id не найден");
    })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(error);
      }
    });
};

module.exports.addUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(error);
      }
    });
};

module.exports.updateUserData = (req, res, next) => {
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
      if (error.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(error);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
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
      if (error.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(error);
      }
    });
};
