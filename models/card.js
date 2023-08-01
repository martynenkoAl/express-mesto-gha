const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, "Название не может быть короче двух символов"],
      maxlength: [30, "Название не может быть длиннее 30 символов"],
      required: [true, "Поле не может быть пустым"],
    },
    link: {
      type: String,
      required: [true, "Поле не может быть пустым"],
      validate: {
        validator(v) {
          return /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/.test(
            v
          );
        },
        message: "Неверный формат URL",
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("card", cardSchema);
