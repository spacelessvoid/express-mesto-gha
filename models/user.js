const mongoose = require("mongoose");
const isURL = require("validator/lib/isURL");
const isEmail = require("validator/lib/isEmail");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: [2, "This field should be at least 2 characters long"],
      maxLength: [30, "This field should be no more than 30 characters long"],
      default: "Жак-Ив Кусто",
    },
    about: {
      type: String,
      minLength: [2, "This field should be at least 2 characters long"],
      maxLength: [30, "This field should be no more than 30 characters long"],
      default: "Исследователь",
    },
    avatar: {
      type: String,
      default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      validate: {
        validator: (v) => isURL(v),
        message: "Incorrect URL",
      },
    },
    email: {
      type: String,
      required: [true, "This field is required"],
      unique: true,
      validate: {
        validator: (v) => isEmail(v),
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      minLength: [8, "Password should be at least 8 characters long"],
      required: [true, "This field is required"],
      select: false,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model("user", userSchema);
