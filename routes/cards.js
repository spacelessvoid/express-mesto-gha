const router = require("express").Router();

const { createCard, getCards, deleteCard } = require("../controllers/cards");

router.post("/", createCard);
router.get("/", getCards);
router.delete("/:cardId", deleteCard);

module.exports = router;
