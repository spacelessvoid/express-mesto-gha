const router = require("express").Router();
const { Joi, celebrate } = require("celebrate");

const {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getUserMe,
} = require("../controllers/users");

router.get("/me", celebrate({
  body: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), getUserMe);
router.get("/", getUsers);
router.get("/:userId", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);
router.patch("/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserProfile);
router.patch("/me/avatar", celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri({ scheme: [/https?/] }),
  }),
}), updateUserAvatar);

module.exports = router;
