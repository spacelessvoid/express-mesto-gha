const { BAD_REQUEST } = require("./error-codes");

class RequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = RequestError;
