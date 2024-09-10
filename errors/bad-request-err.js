const { invalidDataError } = require("../utils/errors");

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = invalidDataError;
  }
}

module.exports = BadRequestError;
