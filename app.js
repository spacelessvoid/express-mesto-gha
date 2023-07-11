const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log(err));

// temporary solution to get user id
app.use((req, res, next) => {
  req.user = { _id: "649bc83e1db378f31ecb038e" };
  next();
});

app.use(bodyParser.json());

app.post("/signup", createUser);
app.post("/signin", login);

app.use(auth);

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.listen(PORT, () => {
  console.log("Server is running");
});
