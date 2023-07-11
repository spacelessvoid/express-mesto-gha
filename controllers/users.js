const bcrypt = require("bcryptjs");
const User = require("../models/user");

const SALT_ROUNDS = 10;

function handleResponse(res, action) {
  return Promise.resolve(action)
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === ("ValidationError" || "CastError")) {
        res
          .status(400)
          .send({ message: `Data validation error: ${err.message}` });
        return;
      }
      if (err.message === "InvalidId") {
        res.status(404).send({ message: `User not found: Invalid ID` });
        return;
      }

      res.status(500).send({ message: `Server error: ${err.message}` });
    });
}

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
    res.statusCode = 201;

    handleResponse(
      res,
      User.create({
        name, about, avatar, email, password: hash,
      }),
    );
  });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  handleResponse(
    res,
    User.findById(userId).orFail(() => new Error("InvalidId")),
  );
};

const getUsers = (req, res) => {
  handleResponse(res, User.find({}));
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  handleResponse(
    res,
    User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    ),
  );
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  handleResponse(res, User.findByIdAndUpdate(req.user._id, { avatar }));
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
};
