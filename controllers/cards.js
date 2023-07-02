const Card = require("../models/card");

function handleResponse(res, action) {
  return Promise.resolve(action)
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === ("ValidationError" || "CastError")) {
        res.status(400).send(`Data validation error: ${err.message}`);
        return;
      }
      if (err.message === "InvalidId") {
        res.status(404).send(`Card not found: Invalid ID`);
        return;
      }

      res.status(500).send(`Server error: ${err.message}`);
    });
}

const getCards = (req, res) => {
  handleResponse(res, Card.find({}));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  res.statusCode = 201;
  handleResponse(res, Card.create({ name, link, owner: req.user._id }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  handleResponse(res, Card.findByIdAndDelete(cardId).orFail(() => new Error("InvalidId")));
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
