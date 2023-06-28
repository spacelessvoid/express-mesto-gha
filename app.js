const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const usersRouter = require("./routes/users");

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb")
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log("Server is running");
});
