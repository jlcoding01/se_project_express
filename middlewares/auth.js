const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorized-err");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError("Authorization Required"));
  }

  const token = authorization.replace("Bearer ", "");

  let playload;

  try {
    playload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError("Authorization Required"));
  }

  req.user = playload;
  return next();
};
