const Card = require("../models/card");

function handleResponse(res, action) {
  return Promise.resolve(action)
    .then((data) => res.send(data))
    .catch((err) => {
      res.status(500).send({ message: `Error: ${err}` });
    });
}

const getCards = (req, res) => {
  handleResponse(res, Card.find({}));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  handleResponse(res, Card.create({ name, link, owner: req.user._id }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  handleResponse(res, Card.findByIdAndDelete(cardId));
};

const likeCard = (req, res) => {
  handleResponse(
    res,
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ),
  );
};

const dislikeCard = (req, res) => {
  handleResponse(
    res,
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ),
  );
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
