const router = require("express").Router();
const {
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { validateCardBody, validateId } = require("../middlewares/validation");

router.post("/", validateCardBody, createClothingItem);
router.delete("/:itemId", validateId, deleteClothingItem);
router.put("/:itemId/likes", validateId, likeItem);
router.delete("/:itemId/likes", validateId, dislikeItem);

module.exports = router;
