
import { useEffect } from 'react'
// import axios from 'axios';
import Navbar from './Navbar';
import { useBookStore } from '../stores/book/bookStore';

interface LoginCheckProps {
  loginCheck: boolean;
}

function Book(
  { loginCheck }: LoginCheckProps
) {
  const { books, fetchBooks, fetchSingleBook, setBooks } = useBookStore();

  useEffect(() => {

    // Se l'utente è loggato effettua la chiamata API
    if (loginCheck) {
      fetchBooks();
    }

    // Se l'utente non è loggato svuota la lista dei libri
    else {
      console.log("User must be logged in");
      setBooks([])
    }

  },
    // [] MEANS THE EFFECT WILL RUN ONCE AND NEVER AGAIN.
    // [count] MEANS THE EFFECT WILL RUN EVERY TIME count CHANGES.
    // WRITE NOTHING (EVENT THE BRACLETS) IF YOU WANT THAT THE EFFECT WILL RUN EVERY TIME THERE IS A CHANGE

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loginCheck]);

  const handleFetchSingleBook = async (bookId: string) => {
    try {
      await fetchSingleBook(bookId);
    } catch (error) {
      console.error(`Failed to fetch book with ID ${bookId}:`, error);
    }
  };

  return (
    <>
      <Navbar />
      {/* Rendering dei titoli dei libri */}
      <div>
        <h1>Book.tsx</h1>

        {/* Mostra un titolo diverso a seconda se l'utente sia loggato o meno */}
        {
          loginCheck ? (
            <h2>Lista dei titoli dei libri:</h2>
          ) : <h2>Effettua il Login per accedere alla lista dei libri</h2>
        }

        {books.map(book => (
          <p
            className='book'
            key={book._id} onClick={() => handleFetchSingleBook(book._id)}>{book.title}</p>
        ))}
      </div>

    </>
  )
}

export default Book