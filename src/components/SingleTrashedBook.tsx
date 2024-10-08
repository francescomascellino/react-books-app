import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBookStore } from '../stores/book/useBookStore';
import { useAuthStore } from "../stores/auth/useAuthStore";
import { observer } from "mobx-react-lite";
import axios, { AxiosError } from "axios";
import { Button } from "@mui/material";
import SnackBar from "./Snackbar";

const SingleTrashedBook = observer(() => {
  const { bookID } = useParams<{ bookID?: string }>();
  const { fetchSingleSoftDeletedBook, deleteBook, restoreBook, singleBook, error, clearError } = useBookStore();
  const { loginStatus } = useAuthStore();
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (bookID) {
      console.log(`From SingleTrashedBook Component useEffect. BookID Changed to: ${bookID}`, 'Fectching Single Soft-Deleted Book:');
      fetchSingleSoftDeletedBook(bookID);
    }
  }, [bookID, fetchSingleSoftDeletedBook]);

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

  const handleDelete = async () => {
    try {
      await deleteBook(bookID!);
      console.log('Book deleted successfully');
      setValidationError('');
      navigate(`/trashed`, { state: { message: 'Libro eliminato definitivamente con successo' } });
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };

  const handleRestore = async () => {
    try {
      await restoreBook(bookID!);
      console.log('Book restored successfully');
      setValidationError('');
      navigate(`/trashed`, { state: { message: 'Libro ripristinato con successo' } });
    } catch (error) {
      console.error('Failed to restore book:', error);
    }
  };

  return (
    <>
      <div>
        <h1>SingleTrashedBook.tsx</h1>

        {loginStatus ? (
          <>
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
            <Button variant="contained" size="medium" color='success' onClick={handleRestore}>Ripristina</Button>

            <Button variant="contained" size="medium" color='error' onClick={handleDelete}>Elimina definitivamente</Button>
          </>
        ) : (
          <h2>Effettua il Login per accedere ai dettagli del libro</h2>
        )}

<SnackBar AlertText={validationError} setAlertText={setValidationError} AlertSeverity='error'/>
      </div>
    </>

  )
});

export default SingleTrashedBook;
