const ClothingItem = require("../models/clothingItem");
const { SOME_ERROR_CODE } = require("../utils/errors");

const getClothingItem = (req, res) => {
  ClothingItem.find({})
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => res.status(500).send({ message: err.message }));
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
          .status(SOME_ERROR_CODE[err.name])
          .send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
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
          .status(SOME_ERROR_CODE[err.name])
          .send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(SOME_ERROR_CODE[err.name])
          .send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.log(err.name);
      if (err.name === "CastError") {
        return res
          .status(SOME_ERROR_CODE[err.name])
          .send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(SOME_ERROR_CODE[err.name])
          .send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
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
          .status(SOME_ERROR_CODE[err.name])
          .send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(SOME_ERROR_CODE[err.name])
          .send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = {
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
