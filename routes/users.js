const router = require("express").Router();
const {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUser,
} = require("../controllers/users");

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);

router.get("/me", getCurrentUser);
router.patch("/me", updateUser);

module.exports = router;
