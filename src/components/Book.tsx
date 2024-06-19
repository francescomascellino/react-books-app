
import { useEffect } from 'react'
import Navbar from './Navbar';
import { useBookStore } from '../stores/book/bookStore';
import { Link, Outlet } from 'react-router-dom';
import '../assets/css/book.css'

interface LoginCheckProps {
  loginCheck: boolean;
}

function Book(
  { loginCheck }: LoginCheckProps
) {
  const { books, fetchBooks, setBooks } = useBookStore();

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

  return (
    <>
      <Navbar />
      <h1>Book.tsx</h1>
      <div className="book-container">

        <div className="book-list">

          {loginCheck ? (
            <h2>Lista dei titoli dei libri:</h2>
          ) : (
            <h2>Effettua il Login per accedere alla lista dei libri</h2>
          )}
          {books.map(book => (
            <Link key={book._id} to={`/books/${book._id}`}>
              <p className="book">{book.title}</p>
            </Link>
          ))}
        </div>
        <div className="book-details">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Book