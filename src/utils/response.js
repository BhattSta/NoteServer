module.exports = {
  createResponseData: (res, data, statusCode, isError, message) => {
    const response = {
      data,
      isError,
      message: isError ? message : message,
    };
    res.status(statusCode);
    res.json(response);
  },
};
