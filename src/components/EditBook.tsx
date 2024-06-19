import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useBookStore } from '../stores/book/bookStore';
import '../assets/css/book.css';

interface LoginCheckProps {
  loginCheck: boolean;
}

function EditBook(
  { loginCheck }: LoginCheckProps
) {
  const { bookID } = useParams();
  const { singleBook, fetchSingleBook } = useBookStore();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [ISBN, setISBN] = useState('');

  useEffect(() => {
    if (bookID) {
      fetchSingleBook(bookID);
      console.log(`Book with ID ${bookID}`, singleBook);

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookID]);

  useEffect(() => {
    if (singleBook) {
      setTitle(singleBook.title);
      setAuthor(singleBook.author);
      setISBN(singleBook.ISBN);
    }
  }, [singleBook]);

  return (
    <>
      <div className="edit-book">
        <h1>EditBook.tsx</h1>

        {loginCheck ? (
          <>
            <h2>Modifica Libro</h2>
            <form>
              <div className="form-group">
                <label htmlFor="title">Titolo</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  minLength={2}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="author">Autore</label>
                <input
                  type="text"
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  minLength={3}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="ISBN">ISBN</label>
                <input
                  type="text"
                  id="ISBN"
                  value={ISBN}
                  onChange={(e) => setISBN(e.target.value)}
                  minLength={13}
                  required
                />
              </div>
              <div>
                <button type="submit">Submit</button>
                {singleBook &&
                  <Link to={`/books/${singleBook._id}`}><button>Annulla</button></Link>
                }
              </div>
            </form>
          </>
        ) : (
          <h2>Effettua il Login per accedere al form di modifica del libro</h2>
        )}



      </div>
    </>

  );
}

export default EditBook;
