const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 5,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    minLength: 5,
  },
  password: {
    type: String,
    required: true,
  },
  favoriteGenre: {
    type: String,
  },
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = User;
