const User = require("../models/user");
const {
  invalidDataError,
  notFoundError,
  defaultError,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log(err.name);
      res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log(err.name);
      if (err.name === "CastError") {
        return res
          .status(invalidDataError)
          .send({ message: "Bad Request! Invalid data passed" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFoundError)
          .send({ message: " The request was sent to a non-existent address" });
      }
      return res
        .status(500)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(invalidDataError)
          .send({ message: "Bad Request! Invalid data passed" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { getUsers, getUser, createUser };
