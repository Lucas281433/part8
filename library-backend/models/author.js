const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 4,
  },
  born: { type: Number },
  bookCount: {
    type: Number,
    default: 0
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

authorSchema.plugin(uniqueValidator);

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
