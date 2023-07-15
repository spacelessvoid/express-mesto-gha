const Card = require("../models/card");
const BadRequestError = require("../errors/request-error");
const NotFoundError = require("../errors/not-found-error");

function handleResponse(res, next, action) {
  return Promise.resolve(action)
    .then((card) => {
      if (!card) {
        next(new NotFoundError("Card not found"));
      }

      res.send(card);
    })
    .catch((err) => {
      if (err.name === ("ValidationError" || "CastError")) {
        next(new BadRequestError(`Data validation error. (${err.message})`));
      }
      next(err);
    });
}

const getCards = (req, res, next) => {
  handleResponse(res, next, Card.find({}));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  res.statusCode = 201;
  handleResponse(res, next, Card.create({ name, link, owner: res.user._id }));
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => new NotFoundError("Card not found"))
    .then((card) => {
      if (card.owner.valueOf() !== res.user._id) {
        next(res.status(403).send({ message: "Unauthorized action" }));
      }
      Card.findByIdAndDelete(cardId).then(() => res.send(card));
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  handleResponse(
    res,
    next,
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: res.user._id } },
      { new: true },
    ),
  );
};

const dislikeCard = (req, res, next) => {
  handleResponse(
    res,
    next,
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
