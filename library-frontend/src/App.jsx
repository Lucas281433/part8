import { useEffect, useState } from "react";
import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recomendations from "./components/Reconmendations";
import { ALL_BOOKS, BOOK_ADDED, USER } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const client = useApolloClient();
  const result = useQuery(USER, {
    pollInterval: 2000,
  });

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addBook = data.data.bookAdded
      window.alert(`${addBook.title} added`)

      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addBook)
        }
      })
    }
  })

  useEffect(() => {
    if (result.data) {
      setUser(result.data.me);
    }
  }, [result.data]);

  if (result.loading) {
    return <div>Loading</div>;
  }

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    setUser(null);
    client.resetStore();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {user ? (
          <button onClick={() => setPage("add")}>add book</button>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
        {user ? (
          <span>
            <button onClick={() => setPage('recomendations')}>recomendations</button>
            <button onClick={handleLogout}>Logout</button>
          </span>
        ) : null}
      </div>

      <Authors show={page === "authors"} user={user} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <LoginForm show={page === "login"} setToken={setToken} />

      <Recomendations show={page === 'recomendations'} />
    </div>
  );
};

export default App;
