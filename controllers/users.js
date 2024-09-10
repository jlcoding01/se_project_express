const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
// const {
//   invalidDataError,
//   authenticationError,
//   notFoundError,
//   defaultError,
//   conflictError,
// } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/bad-request-err");
const UnauthorizedError = require("../errors/unauthorized-err");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-err");

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log(err.name);
      if (err.name === "CastError") {
        next(new BadRequestError("Bad Request! Invalid data passed"));
        // return res
        //   .status(invalidDataError)
        //   .send({ message: "Bad Request! Invalid data passed" });
      } else if (err.name === "DocumentNotFoundError") {
        next(
          new NotFoundError(" The request was sent to a non-existent address")
        );
        // return res
        //   .status(notFoundError)
        //   .send({ message: " The request was sent to a non-existent address" });
      } else {
        next(err);
      }
      // return res
      //   .status(defaultError)
      //   .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    return res
      .status(invalidDataError)
      .send({ message: "Email or Password is required!" });
  }

  return User.findOne({ email })
    .then((matched) => {
      if (matched) {
        const err = new Error("The email already exists!");
        err.code = 11000;
        throw err;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        next(new ConflictError("The email already exists!"));
        // return res
        //   .status(conflictError)
        //   .send({ message: "The email already exists!" });
      } else if (err.name === "ValidationError") {
        next(new BadRequestError("Bad Request! Invalid data passed"));
        // return res
        //   .status(invalidDataError)
        //   .send({ message: "Bad Request! Invalid data passed" });
      } else {
        next(err);
      }
      // return res
      //   .status(defaultError)
      //   .send({ message: "An error has occurred on the server" });
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true, upsert: true }
  )
    .then((user) => res.send(user))
    .catch((err) => {
      console.log(err.name);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Bad Request! Invalid data passed"));
        // return res
        //   .status(invalidDataError)
        //   .send({ message: "Bad Request! Invalid data passed" });
      } else if (err.name === "CastError") {
        next(new BadRequestError("Bad Request! Invalid data passed"));
        // return res
        //   .status(invalidDataError)
        //   .send({ message: "Bad Request! Invalid data passed" });
      } else if (err.name === "DocumentNotFoundError") {
        next(
          new NotFoundError(" The request was sent to a non-existent address")
        );
        // return res
        //   .status(notFoundError)
        //   .send({ message: " The request was sent to a non-existent address" });
      } else {
        next(err);
      }
      // return res
      //   .status(defaultError)
      //   .send({ message: "An error has occurred on the server" });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError("Email and password are required"));
    // return res
    //   .status(invalidDataError)
    //   .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ user, token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect email or password!"));
        // return res
        //   .status(authenticationError)
        //   .send({ message: "Incorrect email or password!" });
      } else {
        next(err);
      }
      // return res
      //   .status(defaultError)
      //   .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  updateUser,
  login,
};
