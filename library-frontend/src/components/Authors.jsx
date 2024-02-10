import { useState } from "react";
import Select from "react-select";
import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const Authors = ({ show, user }) => {
  const [name, setName] = useState(null);
  const [born, setBorn] = useState("");

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })


  const result = useQuery(ALL_AUTHORS);
  
  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>Loading Data...</div>;
  }

  const authors = result.data.allAuthors;

  const setBirthYear = (event) => {
    event.preventDefault()
    const bornInt = parseInt(born)
    editAuthor({ variables: { name: name.value, born: bornInt } })

    setName(null)
    setBorn('')
  }

  const options = authors.map(a => ({ value: a.name, label: a.name }))

  const AuthorBorn = () => (
    <div>  
    <h2>Set Birthyear</h2>
      <form onSubmit={setBirthYear}>
        <div>
          Author:{" "}
          <Select 
            defaultValue={name}
            onChange={setName}
            options={options}
          />
        </div>
        <div>
          Born:{" "}
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">Update Auhtor</button>
      </form>
    </div>
  )

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!user
        ? null
        : AuthorBorn()
      }
    </div>
  );
};

export default Authors;
