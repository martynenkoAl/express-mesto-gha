const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { PORT = 3000, DB_URL = "mongodb://localhost:27017/mestodb" } =
  process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use((req, res, next) => {
  req.user = {
    _id: "64c5eac3397597ac92642bf1",
  };

  next();
});

app.use("*", (req, res) => {
  res.status(404).send({ message: "Страница не найдена" });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
