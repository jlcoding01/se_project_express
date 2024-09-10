const ClothingItem = require("../models/clothingItem");
// const {
//   invalidDataError,
//   notFoundError,
//   defaultError,
//   forbiddenError,
// } = require("../utils/errors");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");

const getClothingItem = (req, res, next) => {
  ClothingItem.find({})
    // .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.log(err.name);
      next(err);
      // res
      //   .status(defaultError)
      //   .send({ message: "An error has occurred on the server" });
    });
};

const createClothingItem = (req, res, next) => {
  const { _id } = req.user;
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: _id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.log(err.name);
      if (err.name === "ValidationError") {
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

const deleteClothingItem = (req, res, next) => {
  const { _id } = req.user;

  ClothingItem.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== _id) {
        next(new ForbiddenError("Request Was Forbidden"));
        // return res
        //   .status(forbiddenError)
        //   .send({ message: "Request Was Forbidden" });
      }
      return ClothingItem.findByIdAndRemove(req.params.itemId).then(() =>
        res.send({ message: "Item successfully deleted", item })
      );
    })
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

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
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

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
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

module.exports = {
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
