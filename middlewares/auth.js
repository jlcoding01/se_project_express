const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { authenticationError } = require("../models/user");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(authenticationError)
      .send({ message: "Authorization Required" });
  }

  const token = authorization.replace("Bearer ", "");

  let playload;

  try {
    playload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(authenticationError)
      .send({ message: "Authorization Required" });
  }

  req.user = playload;
  next();
};
