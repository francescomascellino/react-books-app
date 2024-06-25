import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useBookStore } from '../stores/book/useBookStore';
import { useAuthStore } from '../stores/auth/useAuthStore';
import '../assets/css/book.css';
import axios, { AxiosError } from 'axios';
import { observer } from 'mobx-react-lite';

const EditBook = observer(() => {
  const { bookID } = useParams<{ bookID?: string }>();
  const { singleBook, fetchBooks, fetchSingleBook, pagination, updateBook } = useBookStore();
  const { loginStatus } = useAuthStore();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [ISBN, setISBN] = useState('');
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

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
        await fetchBooks(pagination?.page)
        // Naviga alla pagina del singolo libro con un messaggio di successo
        navigate(`/books/${bookID}`, { state: { message: 'Libro aggiornato con successo' } });
      } else {
        throw new Error('Libro non trovato');
      }
    } catch (error) {
      console.error('Failed to update book:', error);

      // Verifica se l'errore è un oggetto AxiosError e contiene dettagli di validazione
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string[] }>;
        if (axiosError.response?.data && axiosError.response.data.message) {
          const validationError = axiosError.response.data.message;
          console.log(validationError);
          setValidationError(`Errore durante l'aggiornamento del libro: ${validationError}`);
        }
      } else {
        setValidationError(`Errore durante l'aggiornamento del libro: ${error}`);
        console.log(error);
      }

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
                  // COMMENTATO PER PERMETTERE LA GENERAZIONE RAPIDA DI ERRORI
                  // minLength={2}
                  maxLength={50}
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
                  maxLength={50}
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
                  maxLength={13}
                  required
                />
              </div>
              <div>
                <button type="submit">Conferma</button>
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

  )
});

export default EditBook;
