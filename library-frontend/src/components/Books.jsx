import { useQuery } from "@apollo/client";
import { useState } from "react";
import { ALL_BOOKS, ALL_BOOKS_FILTER } from "../queries";

const Books = ({ show }) => {
  const [genre, setGenre] = useState("All");
  const resultAllBooks = useQuery(ALL_BOOKS);
  const resultBooksFilter = useQuery(ALL_BOOKS_FILTER, {
    variables: { genre },
  });

  if (!show) {
    return null;
  }

  if (resultAllBooks.loading) {
    return <div>Loading Data...</div>;
  }

  if (resultBooksFilter.loading) {
    return <div>Loading Data...</div>;
  }

  const books = resultAllBooks.data.allBooks;
  const booksByGenre = resultBooksFilter.data.allBooks;

  const byGenre = ["All"];

  books.forEach((book) => {
    book.genre.forEach((genre) => {
      if (!byGenre.includes(genre)) {
        byGenre.push(genre);
      }
    });
  });

  return (
    <div>
      <h2>Books</h2>
      <div>
        in genre <strong>{genre}</strong>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {genre === "All"
            ? books.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ))
            : booksByGenre.map((a) => (
                <tr key={a.title}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ))}
        </tbody>
      </table>
      <div>
        {byGenre.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
