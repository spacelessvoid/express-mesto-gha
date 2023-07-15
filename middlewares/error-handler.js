const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message, name } = err;

  res.status(statusCode).send({
    message:
      statusCode === 500 ? `Server error: ${message} (${name})` : message,
  });

  next();
};

module.exports = errorHandler;
