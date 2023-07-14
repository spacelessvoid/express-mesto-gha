const mongoose = require("mongoose");
const isURL = require("validator/lib/isURL");

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: [2, "This field should be at least 2 characters long"],
      maxLength: [30, "This field should be no more than 30 characters long"],
      required: [true, "This field is required"],
    },
    link: {
      type: String,
      required: [true, "This field is required"],
      validate: {
        validator: (v) => isURL(v),
        message: "Incorrect URL",
      },
    },
    owner: {
      type: mongoose.ObjectId,
      required: true,
    },
    likes: {
      type: [mongoose.ObjectId],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model("card", cardSchema);
