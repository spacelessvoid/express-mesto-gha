const mongoose = require("mongoose");
const validator = require("validator/lib/isURL");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: [2, "This field should be at least 2 characters long"],
      maxLength: [30, "This field should be no more than 30 characters long"],
      required: [true, "This field is required"],
    },
    about: {
      type: String,
      minLength: [2, "This field should be at least 2 characters long"],
      maxLength: [30, "This field should be no more than 30 characters long"],
      required: [true, "This field is required"],
    },
    avatar: {
      type: String,
      required: [true, "This field is required"],
      validate: {
        validator: (v) => validator.isURL(v),
        message: "Incorrect URL",
      },
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model("user", userSchema);
