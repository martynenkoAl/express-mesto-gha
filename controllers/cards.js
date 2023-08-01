const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() =>
      res.status(500).send({ message: "На сервере произошла ошибка" })
    );
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      res.status(404).send({ message: "Карточка с таким id не найдена" });
    })
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      res.status(404).send({ message: "Карточка с таким id не найдена" });
    })
    .then((like) => res.send(like))
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(400).send({ message: error.message });
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
    .orFail(() => {
      res.status(404).send({ message: "Карточка с таким id не найдена" });
    })
    .then((like) => res.send(like))
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};
