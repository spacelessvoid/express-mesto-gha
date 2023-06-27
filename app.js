const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/mestodb");

app.listen(PORT, () => {});
