const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(["owner", "likes"])
    .then((cards) => res.send(cards))
    .catch(() =>
      res.status(500).send({ message: "На сервере произошла ошибка" })
    );
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate("owner")
        .then((data) => res.status(201).send(data))
        .catch(() => res.status(404).send({ message: "Карточка не найдена" }));
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Переданы некорректные данные" });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: "Карточка не найдена" });
          return;
        }
        res.send({ message: "Карточка удалена" });
      })
      .catch(() =>
        res.status(400).send({ message: "Переданы некорректные данные" })
      );
  } else {
    res.status(500).send({ message: "На сервере произошла ошибка" });
  }
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: "Карточка не найдена" });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: "Переданы некорректные данные" });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: "Карточка не найдена" });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: "Переданы некорректные данные" });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};
