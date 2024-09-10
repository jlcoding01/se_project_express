const { conflictError } = require("../utils/errors");

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = conflictError;
  }
}

module.exports = ConflictError;
