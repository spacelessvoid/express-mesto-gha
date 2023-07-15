const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { errors } = require("celebrate");

const app = express();

const { PORT = 3000, DB_URL = "mongodb://127.0.0.1:27017/mestodb" } = process.env;
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { createUser, login } = require("./controllers/users");
const { auth } = require("./middlewares/auth");
const { validateSignIn, validateSignUp } = require("./middlewares/validation");
const NotFoundError = require("./errors/not-found-error");
const errorHandler = require("./middlewares/error-handler");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log(err));

app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());

app.post("/signup", validateSignUp(), createUser);
app.post("/signin", validateSignIn(), login);

app.use("/users", auth, usersRouter);
app.use("/cards", auth, cardsRouter);

app.use("*", (req, res, next) => {
  next(new NotFoundError("Requested resource was not found"));
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running");
});
