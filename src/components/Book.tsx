
import { useEffect } from 'react'
import Navbar from './Navbar';
import { useBookStore } from '../stores/book/bookStore';
import { Link, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/auth/useAuthStore';
import '../assets/css/book.css'

function Book() {
  const { books, fetchBooks, setBooks, pagination } = useBookStore();
  const { loginStatus } = useAuthStore();

  useEffect(() => {

    // Se l'utente è loggato effettua la chiamata API
    if (loginStatus) {
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
    [
      loginStatus,
      // books MUST FIX LOOP
    ]);

  const handlePageChange = (newPage: number) => {
    fetchBooks(newPage);
  };

  return (
    <>
      <Navbar />
      <h1>Book.tsx</h1>
      <div className="book-container">
        <div className="book-list">
          <div className='book-list-wrapper'>
            {loginStatus ? (
              <>
                <h2>Lista dei titoli dei libri:</h2>
                {books.map((book) => (
                  <Link key={book._id} to={`/books/${book._id}`}>
                    <p className="book">{book.title}</p>
                  </Link>
                ))}
              </>
            ) : (
              <h2>Effettua il Login per accedere alla lista dei libri</h2>
            )}
          </div>
          <div>
            {/* Paginazione */}
            {pagination && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(pagination.prevPage!)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    disabled={pagination.page === i + 1}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.nextPage!)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>


        {/* <div className="book-list">

          {loginStatus ? (
            <h2>Lista dei titoli dei libri:</h2>
          ) : (
            <h2>Effettua il Login per accedere alla lista dei libri</h2>
          )}
          {books.map(book => (
            <Link key={book._id} to={`/books/${book._id}`}>
              <p className="book">{book.title}</p>
            </Link>
          ))}
        </div> */}

        <div className="book-details">
          <Outlet />
        </div>

      </div>
    </>
  )
}

export default Book