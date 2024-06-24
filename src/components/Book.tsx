import { useEffect } from 'react'
import Navbar from './Navbar';
import { useBookStore } from '../stores/book/useBookStore';
import { Link, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/auth/useAuthStore';
import '../assets/css/book.css'
import { observer } from 'mobx-react-lite';

// Wrappiamo il componente cob observer()
const Book = observer(() => {
  const { books, fetchBooks, setBooks, pagination } = useBookStore();
  const { loginStatus } = useAuthStore();

  useEffect(() => {
    // Se l'utente è loggato effettua la chiamata API
    if (loginStatus) {
      fetchBooks();
    } else {
      // Se l'utente non è loggato svuota la lista dei libri
      // setBooks([]);
      console.log("User must be logged in");
    }

  },
    // [] MEANS THE EFFECT WILL RUN ONCE AND NEVER AGAIN.
    // [loginStatus] MEANS THE EFFECT WILL RUN EVERY TIME loginStatus CHANGES.
    // WRITE NOTHING (EVEN THE BRACLETS) IF YOU WANT THAT THE EFFECT WILL RUN EVERY TIME THERE IS A CHANGE
    [loginStatus, fetchBooks, setBooks]);

  const handlePageChange = (newPage: number) => {
    // fetchBooks accetta i seguenti parametri: const fetchBooks = async (page: number = 1, pageSize: number = 10)
    // Chiama fetchBooks con il nuovo numero di pagina, lasciando pageSize al suo default di 10
    fetchBooks(newPage);
  };

  return (
    <>
      <Navbar />
      <h1>Book.tsx</h1>
      <div className="book-container">
        <div className="book-list">
          <div className='book-list-wrapper'>
            {loginStatus && books.length > 0 ? (
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
            {pagination && loginStatus && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(pagination.prevPage!)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </button>
                {/* Array.from crea un array di lunghezza pagination.totalPages. */}
                {/* { length: pagination.totalPages } specifica la lunghezza dell'array, che è il numero totale di pagine disponibili. */}
                {/* _ è usato come convenzione per indicare un parametro che non verrà utilizzato nella mapFn di Array.from() */}
                {/* i: è il secondo parametro della funzione di mappatura. Rappresenta l'indice dell'elemento corrente nell'array generato da Array.from */}
                {/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from */}
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  // Crea un button per ogni indice dell'array
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
});

export default Book