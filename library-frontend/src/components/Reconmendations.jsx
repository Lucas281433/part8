import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { USER, ALL_BOOKS_FILTER } from "../queries";

const Recomendations = ({ show }) => {
  const [genre, setGenre] = useState(null);
  const resultUser = useQuery(USER);
  const user = resultUser.data?.me;
  
  useEffect(() => {
    setGenre(user?.favoriteGenre || null);
  }, [user?.favoriteGenre]);
  
  const resultBooksFilter = useQuery(ALL_BOOKS_FILTER, {
    variables: { genre },
  });
  
  const books = resultBooksFilter.data?.allBooks;
  
  if (resultUser.loading || resultBooksFilter.loading) {
    return <div>Loading Data...</div>;
  }
  
  if (!show) {
    return null;
  }
  
  return (
    <div>
      <h2>Recomendations</h2>
      <p>
        Books in your favorite genre <strong>{genre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recomendations;
