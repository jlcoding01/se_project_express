const { authenticationError } = require("../utils/errors");

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = authenticationError;
  }
}

module.exports = UnauthorizedError;
