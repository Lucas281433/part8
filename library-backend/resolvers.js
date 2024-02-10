const { GraphQLError } = require("graphql");
const { PubSub } = require("graphql-subscriptions");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("./utils/config");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");

const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const author = await Author.findOne({ name: args.author });
      if (args.author) {
        return Book.find({ author: author });
      } else if (args.genre) {
        return Book.find({ genre: { $in: args.genre } });
      } else {
        return Book.find({});
      }
    },
    allAuthors: async () => Author.find({}),
    me: async (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      let author = await Author.findOne({ name: args.author });

      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("Not Authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      if (!author) {
        author = new Author({
          name: args.author,
        });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError(
            "The name has to be unique and requires a minimum of 4 letters",
            {
              extensions: {
                code: "GRAPHQL_VALIDATION_FAILED",
                invalidArgs: args.author,
                error,
              },
            }
          );
        }
      }
      const newBook = new Book({
        title: args.title,
        author: author._id,
        published: args.published,
        genre: args.genre,
      });
      try {
        await newBook.save();
        await newBook.populate("author");
        author.books = author.books.concat(newBook._id);
        author.bookCount += 1;
        await author.save();

        pubsub.publish("BOOK_ADDED", { bookAdded: newBook });

        return newBook;
      } catch (error) {
        throw new GraphQLError(
          "The title must be unique and requires a minimum of 5 letters",
          {
            extensions: {
              code: "GRAPHQL_VALIDATION_FAILED",
              invalidArgs: args.title,
              error,
            },
          }
        );
      }
    },
    editAuthor: async (root, args, context) => {
      let author = await Author.findOne({ name: args.name });

      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("Not Authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      if (!author) {
        throw new GraphQLError("Author not found", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      try {
        author.born = args.setBornTo;
        await author.save();
        return author;
      } catch (error) {
        throw new GraphQLError("Error updating Author", {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      }
    },
    createUser: async (root, args) => {
      const passwordHash = await bcrypt.hash(args.password, 10);
      const user = new User({
        username: args.username,
        name: args.name,
        password: passwordHash,
        favoriteGenre: args.favoriteGenre,
      });

      try {
        await user.save();
        return user;
      } catch (error) {
        throw new GraphQLError(
          "The username must be unique and must have at least 5 letters like the name",
          {
            extensions: {
              code: "GRAPHQL_VALIDATION_FAILED",
              invalidArgs: args.username,
              error,
            },
          }
        );
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      const passwordCorrect =
        user === null
          ? false
          : await bcrypt.compare(args.password, user.password);

      if (!(user && passwordCorrect)) {
        throw new GraphQLError("Wrong Credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      const token = { value: jwt.sign(userForToken, config.JWT_SECRET) };
      return token;
    },
  },
  Book: {
    author: async (root) => {
      const author = Author.findById(root.author);
      return author || null;
    },
  },
  Author: {
    bookCount: async (root) =>
      Book.collection.countDocuments({ author: root._id }),
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
