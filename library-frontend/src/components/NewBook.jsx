import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS, ALL_BOOKS_FILTER } from '../queries'

const NewBook = ({ show }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [gen, setGen] = useState('')
  const [genre, setGenre] = useState([])

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }, { query: ALL_BOOKS_FILTER }]
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    const publishedInt = parseInt(published)
    addBook({ variables: { title, author, published: publishedInt, genre } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenre([])
    setGen('')
  }

  const addGenre = () => {
    setGenre(genre.concat(gen))
    setGen('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={gen}
            onChange={({ target }) => setGen(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genre: {genre.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
