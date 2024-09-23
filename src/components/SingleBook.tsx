import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useBookStore } from '../stores/book/useBookStore';
import { useAuthStore } from "../stores/auth/useAuthStore";
import { observer } from "mobx-react-lite";
import axios, { AxiosError } from "axios";
import { Button } from "@mui/material";
import SnackBar from "./Snackbar";

const SingleBook = observer(() => {
  const { bookID } = useParams<{ bookID?: string }>();
  const { fetchSingleBook, softDeleteBook, singleBook, error, clearError } = useBookStore();
  const { loginStatus } = useAuthStore();
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (bookID) {
      console.log(`From SingleBook Component useEffect. BookID Changed to: ${bookID}`, 'Fectching Single Book:');
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
            <div className="card">
              {singleBook ? (
                <>
                  <h2>{singleBook.title}</h2>
                  <p>Autore: {singleBook.author}</p>
                  <p>ISBN: {singleBook.ISBN}</p>
                  {singleBook.loaned_to && singleBook.loaned_to.name ? <p>Affittato a {singleBook.loaned_to.name}</p> : <p>Libro disponibile</p>}
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <Button variant="contained" size="medium" component={Link} to={`/books/${bookID}/edit`}>Modifica</Button>
            <Button variant="contained" size="medium" color='error' onClick={handleSoftDelete}>Sposta nel Cestino</Button>
          </>
        ) : (
          <h2>Effettua il Login per accedere ai dettagli del libro</h2>
        )}

        <div>

        <SnackBar AlertText={validationError} setAlertText={setValidationError} />
        </div>
      </div>
    </>

  )
});

export default SingleBook;