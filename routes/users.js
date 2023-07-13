const router = require("express").Router();

const {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getUserMe,
} = require("../controllers/users");

router.get("/me", getUserMe);
router.get("/", getUsers);
router.get("/:userId", getUserById);
router.patch("/me", updateUserProfile);
router.patch("/me/avatar", updateUserAvatar);

module.exports = router;
