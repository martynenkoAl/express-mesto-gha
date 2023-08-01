const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res.status(500).send({ message: "На сервере произошла ошибка" })
    );
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      res.status(404).send({ message: "Пользователь с таким id не найден" });
    })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
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
      if (error.name === "ValidationError") {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
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
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};
