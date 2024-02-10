const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minLength: 5,
  },
  published: {
    type: Number,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
  genre: [{ type: String }],
});

bookSchema.plugin(uniqueValidator);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
