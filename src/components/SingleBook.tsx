import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useBookStore } from '../stores/book/useBookStore';
import { useAuthStore } from "../stores/auth/useAuthStore";
import { observer } from "mobx-react-lite";
import axios, { AxiosError } from "axios";

const SingleBook = observer(() => {
  const { bookID } = useParams<{ bookID?: string }>();
  const { fetchSingleBook, softDeleteBook, singleBook, error, clearError } = useBookStore();
  const { loginStatus } = useAuthStore();
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (bookID) {
      console.log(`BookID Changed ${bookID}`);
      fetchSingleBook(bookID);
    }
  }, [bookID, fetchSingleBook]);

  useEffect(() => {
    if (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string[] }>;
        if (axiosError.response?.data && axiosError.response.data.message) {
          const validationError = axiosError.response.data.message;
          console.log(validationError);
          setValidationError(`Errore durante l'aggiornamento del libro: ${validationError}`);
        } else {
          setValidationError(`Errore durante l'aggiornamento del libro: ${error.message}`);
          console.log(error.message);
        }
      } else {
        setValidationError(`Errore durante l'aggiornamento del libro: ${error.message}`);
        console.log(error.message);
      }
      clearError();
    }
  }, [error, clearError]);

  const handleSoftDelete = async () => {
    try {
      await softDeleteBook(bookID!);
      console.log('Book moved to trash successfully');
      navigate(`/books`, { state: { message: 'Libro spostato nel cestino con successo' } });
    } catch (error) {
      console.error('Failed to move book to trash:', error);
    }
  };

  return (
    <>
      <div>
        <h1>SingleBook.tsx</h1>

        {loginStatus ? (
          <>
            {/* Messaggio di stato
            {location.state?.message &&
              <div className="card">
                <p style={{ color: 'green' }}>{location.state.message}</p>
              </div>
            } */}

            <div className="card">
              {singleBook ? (
                <>
                  <h2>{singleBook.title}</h2>
                  <p>Autore: {singleBook.author}</p>
                  <p>ISBN: {singleBook.ISBN}</p>
                  {singleBook.loaned_to && <p>Affittato a {singleBook.loaned_to.name}</p>}
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <Link to={`/books/${bookID}/edit`}><button>Modifica</button></Link>
            <button onClick={handleSoftDelete}>Sposta nel Cestino</button>
          </>
        ) : (
          <h2>Effettua il Login per accedere ai dettagli del libro</h2>
        )}

        <div>
          {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
        </div>
      </div>
    </>

  )
});

export default SingleBook;