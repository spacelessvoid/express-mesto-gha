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
const NotFoundError = require("./errors/not-found-error");

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

app.use("*", (req, res, next) => {
  next(new NotFoundError("Requested resource was not found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message, name } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? `Server error: ${message} (${name})` : message,
  });

  next();
});

app.listen(PORT, () => {
  console.log("Server is running");
});
