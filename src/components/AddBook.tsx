import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBookStore } from '../stores/book/useBookStore';
import { useAuthStore } from '../stores/auth/useAuthStore';
import '../assets/css/book.css';
import axios, { AxiosError } from 'axios';
import { observer } from 'mobx-react-lite';
import SnackBar from './Snackbar';

const AddBook = observer(() => {
  const { fetchBooks, addBook, pagination } = useBookStore();
  const { loginStatus } = useAuthStore();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [ISBN, setISBN] = useState('');
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newBook = await addBook({ title, author, ISBN });
      console.log('Book added successfully', newBook);
      fetchBooks(pagination?.page)

      await fetchBooks(pagination?.page);

      console.log('From handleSubmit - addBook. New book added. id:', newBook._id);

      setValidationError('');

      navigate(`/books/${newBook._id}`, { state: { message: 'Libro aggiunto con successo' } });

    } catch (error) {
      console.error('Failed to add book:', error);

      // Verifica se l'errore è un oggetto AxiosError e contiene dettagli di validazione
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string[] }>;
        if (axiosError.response?.data && axiosError.response.data.message) {
          const validationError = axiosError.response.data.message;
          console.log(validationError);
          setValidationError(`Errore durante la creazione del libro: ${validationError}`);
        }
      } else {
        setValidationError(`Errore durante la creazione del libro: ${error}`);
      }
    }
  };

  return (
    <>
      <div className="edit-book">
        <h1>AddBook.tsx</h1>

        {loginStatus ? (
          <>
            <h2>Aggiungiun nuovo Libro</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Titolo</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  minLength={2}
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
                <Link to="/books"><button>Annulla</button></Link>
              </div>
            </form>

            <SnackBar AlertText={validationError} setAlertText={setValidationError} AlertSeverity='error'/>

          </>
        ) : (
          <h2>Effettua il Login per accedere al form di modifica del libro</h2>
        )}

      </div>
    </>

  )
});

export default AddBook;
