const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb")
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log(err));

app.use((req, res, next) => {
  req.user = { _id: "649bc83e1db378f31ecb038e" };
  next();
});

app.use(bodyParser.json());
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.listen(PORT, () => {
  console.log("Server is running");
});
