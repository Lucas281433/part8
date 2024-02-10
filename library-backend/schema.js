const typeDefs = `
    type User {
        username: String!
        name: String!
        password: String!
        favoriteGenre: String!
        id: ID!
    }

    type Token {
        value: String!
    }

    type Author {
        name: String!
        born: Int
        id: ID!
        bookCount: Int
    }

    type Book {
        title: String!
        published: Int!
        author: Author!
        genre: [String!]!
        id: ID!
    }

    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
        me: User
    }

    type Mutation {
        addBook(
            title: String!
            author: String!
            published: Int!
            genre: [String!]
        ): Book!

        editAuthor(
            name: String!
            setBornTo: Int!
        ): Author!

        createUser(
            username: String!
            name: String!
            password: String!
            favoriteGenre: String!
        ): User

        login(
            username: String!
            password: String!
        ): Token
    }
    
    type Subscription {
        bookAdded: Book!
    }
`;

module.exports = typeDefs;
