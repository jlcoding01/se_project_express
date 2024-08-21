const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  invalidDataError,
  authenticationError,
  notFoundError,
  defaultError,
  conflictError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const validator = require("validator");

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

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
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
  const { name, avatar, email, password } = req.body;

  if (!email) {
    return res
      .status(invalidDataError)
      .send({ message: "Email or Password is required!" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).send({ message: "Invalid email format" });
  }

  User.findOne({ email })
    .then((matched) => {
      if (matched) {
        const err = new Error("The email already exists!");
        err.code = 11000;
        throw err;
        // return Promise.reject(new Error("The email already exists!"));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      User.create({ name, avatar, email, password: hash }).then((user) =>
        res.status(201).send({
          name: user.name,
          avatar: user.avatar,
          email: user.email,
        })
      );
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res
          .status(conflictError)
          .send({ message: "The email already exists!" });
      }
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

const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true, upsert: true }
  )
    .then((user) => res.send(user))
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

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send(token);
    })
    .catch((err) => {
      res
        .status(authenticationError)
        .send({ message: "Incorrect email or password!" });
    });
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUser,
  login,
};
