const User = require("../models/user");
const { SOME_ERROR_CODE } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log(err.name);
      if (err.name === "CastError") {
        return res
          .status(SOME_ERROR_CODE[err.name])
          .send({ message: err.message });
      } else if (err.name === "DocumentNotFoundError") {
        return res
          .status(SOME_ERROR_CODE[err.name])
          .send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { getUsers, getUser, createUser };
