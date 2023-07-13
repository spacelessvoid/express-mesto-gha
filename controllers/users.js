const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../middlewares/auth");

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
        name,
        about,
        avatar,
        email,
        password: hash,
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
  handleResponse(
    res,
    User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    ),
  );
};

const login = (req, res) => {
  const { email, password } = req.body;

  // TODO Refactor to use ` return Promise.reject(new Error('InvalidEmailPassword')); `

  if (!email || !password) return res.status(400).send({ message: "Please provide email and password" });

  return User.findOne({ email })
    .then((user) => {
      if (!user) return res.status(400).send({ message: "User doesn't exist" });

      bcrypt.compare(password, user.password, (err, isValidPassword) => {
        if (!isValidPassword) return res.status(401).send({ message: "Invalid password" });

        const token = jwt.sign({ _id: user.id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        res.send({ token });
      });
    })
    .catch((err) => {
      res.status(401).send(err);
    });
};

const getUserMe = (req, res) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Нет пользователя с таким id" });
      }

      return res.status(200).send(user);
    })
    .catch((err) => res.status(400).send(err));
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  login,
  getUserMe,
};
