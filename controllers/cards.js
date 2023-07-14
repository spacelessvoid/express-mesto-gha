const Card = require("../models/card");

function handleResponse(res, action) {
  return Promise.resolve(action)
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === ("ValidationError" || "CastError")) {
        res.status(400).send({ message: `Data validation error: ${err.message}` });
        return;
      }
      if (err.message === "InvalidId") {
        res.status(404).send({ message: `Card not found: Invalid ID` });
        return;
      }

      res.status(500).send({ message: `Server error: ${err.message}` });
    });
}

const getCards = (req, res) => {
  handleResponse(res, Card.find({}));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  res.statusCode = 201;
  handleResponse(res, Card.create({ name, link, owner: res.user._id }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .orFail(() => new Error("InvalidId"))
    .then((card) => {
      if (card.owner !== res.user._id) {
        return res.status(403).send({ message: "Unauthorized action" });
      }

      res.send(card);
    })
    .catch((err) => res.status(400).send({ message: `${err}` }));
};

const likeCard = (req, res) => {
  handleResponse(
    res,
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: res.user._id } },
      { new: true },
    ),
  );
};

const dislikeCard = (req, res) => {
  handleResponse(
    res,
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: res.user._id } },
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
