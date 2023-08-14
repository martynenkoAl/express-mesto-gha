const { STATUS_INTERNAL_SERVER_ERROR } = require('../utils/constants');

const errorHandler = (error, req, res, next) => {
  const { statusCode = STATUS_INTERNAL_SERVER_ERROR, message } = error;
  res.status(statusCode).send({
    message:
      statusCode === STATUS_INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
  });
  next();
};

module.exports = errorHandler;
