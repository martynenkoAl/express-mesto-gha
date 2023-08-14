require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { router } = require('./routes/index');
const { STATUS_NOT_FOUND } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '64c6ede6b652b44415d2ace9',
  };

  next();
});

app.use(router);

app.use('*', (req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => PORT);
