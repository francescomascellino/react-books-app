import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useBookStore } from '../stores/book/bookStore';
import { useAuthStore } from '../stores/auth/useAuthStore';
import '../assets/css/book.css';

// interface LoginCheckProps {
//   loginCheck: boolean;
// }

function EditBook(
  // { loginCheck }: LoginCheckProps
) {
  const { bookID } = useParams<{ bookID?: string }>();
  const { singleBook, fetchSingleBook, updateBook } = useBookStore();
  const { loginStatus } = useAuthStore();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [ISBN, setISBN] = useState('');
  const [validationError, setValidationError] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (bookID) {
        await updateBook(bookID, { title, author, ISBN });
        console.log('Book updated successfully');

        // Naviga alla pagina del singolo libro dopo l'aggiornamento
      } else {
        throw new Error('bookID non definito');
      }
    } catch (error) {
      console.error('Failed to update book:', error);
      // Gestisci gli errori di validazione qui, se necessario
      setValidationError('Errore durante l\'aggiornamento del libro.');
    }
  };

  return (
    <>
      <div className="edit-book">
        <h1>EditBook.tsx</h1>

        {loginStatus ? (
          <>
            <h2>Modifica Libro</h2>
            <form onSubmit={handleSubmit}>
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
            {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
          </>
        ) : (
          <h2>Effettua il Login per accedere al form di modifica del libro</h2>
        )}



      </div>
    </>

  );
}

export default EditBook;
