const User = require("../models/user");

function handleResponse(res, action) {
  return Promise.resolve(action)
    .then((data) => res.send(data))
    .catch((err) => {
      res.status(400).send({ message: `Error: ${err}` });
    });
}

const getUserById = (req, res) => {
  const { userId } = req.params;
  handleResponse(res, User.findById(userId));
};

const getUsers = (req, res) => {
  handleResponse(res, User.find({}));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  handleResponse(res, User.create({ name, about, avatar }));
};

module.exports = { getUsers, getUserById, createUser };
