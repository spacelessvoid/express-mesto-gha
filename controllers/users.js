const User = require("../models/user");

function handleResponse(res, action) {
  return Promise.resolve(action)
    .then((data) => res.send(data))
    .catch((err) => {
      res.status(400).send({ message: `Error: ${err}` });
    });
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  handleResponse(res, User.create({ name, about, avatar }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  handleResponse(res, User.findById(userId));
};

const getUsers = (req, res) => {
  handleResponse(res, User.find({}));
};

const updateUserProfile = (req, res) => {};

const updateUserAvatar = (req, res) => {
  console.log(req.user._id);
  const { avatar } = req.body;
  console.log(avatar);
  handleResponse(res, User.findByIdAndUpdate(req.user._id, { avatar }));
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
};
