const Card = require("../models/card");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError("Карточка с таким id не найдена");
    })
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(error);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Карточка с таким id не найдена");
    })
    .then((like) => res.send(like))
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(error);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Карточка с таким id не найдена");
    })
    .then((like) => res.send(like))
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(error);
      }
    });
};
