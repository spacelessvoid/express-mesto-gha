/* eslint-disable object-curly-newline */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../middlewares/auth");
const BadRequestError = require("../errors/request-error");
const NotFoundError = require("../errors/not-found-error");
const AuthError = require("../errors/authorization-error");
const { CREATED, CONFLICT } = require("../errors/error-codes");

const SALT_ROUNDS = 10;

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
    User.create({ name, about, avatar, email, password: hash })
      .then((user) => {
        // eslint-disable-next-line no-shadow
        const { name, about, avatar, email } = user;
        res.status(CREATED).send({ name, about, avatar, email });
      })
      .catch((error) => {
        if (error.name === ("ValidationError" || "CastError")) {
          next(new BadRequestError(`Data validation error. (${error.message})`));
          return;
        }
        if (error.code === 11000) {
          next(res.status(CONFLICT).send({
            message: `User with this email already exists (${error.message})`,
          }));
          return;
        }
        next(error);
      });
  });
};

function handleResponse(res, next, action) {
  return Promise.resolve(action)
    .then((user) => {
      if (!user) {
        next(new NotFoundError("There is no user with this id"));
        return;
      }

      res.send(user);
    })
    .catch((err) => {
      if (err.name === ("ValidationError" || "CastError")) {
        next(new BadRequestError(`Data validation error. (${err.message})`));
        return;
      }
      next(err);
    });
}

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  handleResponse(res, next, User.findById(userId).orFail(() => new NotFoundError("User not found")));
};

const getUsers = (req, res, next) => {
  handleResponse(res, next, User.find({}));
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  handleResponse(
    res,
    next,
    User.findByIdAndUpdate(
      res.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    ),
  );
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  handleResponse(
    res,
    next,
    User.findByIdAndUpdate(
      res.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    ),
  );
};

const getUserMe = (req, res, next) => {
  handleResponse(res, next, User.findOne({ _id: res.user._id }));
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError("Please provide email and password"));
    return;
  }

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        next(new AuthError("User doesn't exist"));
        return;
      }

      bcrypt.compare(password, user.password, (err, isValidPassword) => {
        if (!isValidPassword) {
          next(new AuthError("Invalid password"));
          return;
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        res.send({ token });
      });
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getUserMe,
  login,
};
