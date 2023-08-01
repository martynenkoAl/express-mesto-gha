const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const NotFoundError = require("./errors/NotFoundError");

const app = express();

const { PORT = 3000 } = process.env;
mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "64c6ede6b652b44415d2ace9",
  };

  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use("*", () => {
  throw new NotFoundError("Страница не найдена");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
