const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      res.status(400).send({ message: `Произошла ошибка: ${err}` });
    });
};

const getUserId = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => res.send(user))
    .catch((err) => {
      res.status(400).send({ message: `Произошла ошибка: ${err}` });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.params;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      res.status(400).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports = { getUsers, getUserId, createUser };
