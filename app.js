const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { router } = require('./routes/index');
const {
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(router);

app.use('*', (req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });
});

app.use(errors());

app.use((error, req, res, next) => {
  const { statusCode = STATUS_INTERNAL_SERVER_ERROR, message } = error;
  res.status(statusCode).send({
    message:
      statusCode === STATUS_INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
  });
  next();
});

app.listen(PORT, () => PORT);
