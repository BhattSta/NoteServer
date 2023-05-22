const httpStatus = require("http-status");

const errorHandler = (err, req, res, next) => {
  let { message } = err;
  console.log(message);
  statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  errorMessage = message;

  const response = {
    errorMessage: message,
  };

  res.status(statusCode).send(response);
};

module.exports = {
  errorHandler,
};
