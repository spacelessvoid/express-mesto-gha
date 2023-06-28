const Card = require("../models/card");

function handleResponse(res, action) {
  return Promise.resolve(action)
    .then((data) => res.send(data))
    .catch((err) => {
      res.status(400).send({ message: `Error: ${err}` });
    });
}

const getCards = (req, res) => {
  handleResponse(res, Card.find({}));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  handleResponse(res, Card.create({ name, link, owner }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  handleResponse(res, Card.findByIdAndDelete(cardId));
};

module.exports = { getCards, createCard, deleteCard };
