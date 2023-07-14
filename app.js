const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { celebrate, Joi } = require("celebrate");

const app = express();
const PORT = 3000;
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { createUser, login } = require("./controllers/users");
const { auth } = require("./middlewares/auth");

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());

app.post("/signup", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(auth);

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.listen(PORT, () => {
  console.log("Server is running");
});
