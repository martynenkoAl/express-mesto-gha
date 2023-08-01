const express = require('express');
const mongoose = require('mongoose');
const { routes } = require('./routes/index');
const { STATUS_NOT_FOUND } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '64c6ede6b652b44415d2ace9',
  };

  next();
});

app.use(routes);

app.use('*', (req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => PORT);
