const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use((req, res, next) => {
  req.user = {
    _id: "64c6ede6b652b44415d2ace9",
  };

  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use("*", (req, res) => {
  res.status(404).send({ message: "Страница не найдена" });
});

mongoose.connect("mongodb://localhost:27017/mestodb");

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
