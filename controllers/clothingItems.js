const ClothingItem = require("../models/clothingItem");
const {
  invalidDataError,
  notFoundError,
  defaultError,
} = require("../utils/errors");

const getClothingItem = (req, res) => {
  ClothingItem.find({})
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) =>
      res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" })
    );
};

const createClothingItem = (req, res) => {
  const { _id } = req.user;
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: _id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.log(err.name);
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

const deleteClothingItem = (req, res) => {
  ClothingItem.findByIdAndRemove(req.params.itemId)
    .orFail()
    .then((item) => res.send(item))
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
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res) => {
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
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

const dislikeItem = (req, res) => {
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
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
