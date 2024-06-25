import { useEffect } from 'react'
import Navbar from './Navbar';
import { useBookStore } from '../stores/book/useBookStore';
import {
  Link, Outlet, useLocation,
  useNavigate
} from 'react-router-dom';
import { useAuthStore } from '../stores/auth/useAuthStore';
import '../assets/css/book.css'
import { observer } from 'mobx-react-lite';

// Wrappiamo il componente cob observer()
const Book = observer(() => {
  const { trashedBooks, fetchTrashed, setBooks, pagination } = useBookStore();
  const { loginStatus } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Se l'utente è loggato effettua la chiamata API
    if (loginStatus) {
      fetchTrashed();
    } else {
      console.log("User must be logged in");
    }

  },
    [loginStatus, fetchTrashed, setBooks]);

  const handlePageChange = (
    newPage: number

  ) => {
    navigate('/trashed');
    fetchTrashed(newPage);
  };

  return (
    <>
      <Navbar />
      <h1>TrashedBooks.tsx</h1>
      {/* Messaggio di stato */}
      <div style={{ height: '70px' }}>
        {location.state?.message &&
          <div className="card">
            <p style={{ color: 'green' }}>{location.state.message}</p>
          </div>
        }
      </div>

      <div className="book-container">
        <div className="book-list">
          <div className='book-list-wrapper'>

            {loginStatus && trashedBooks.length > 0 ? (
              <>
                <h2>Lista dei libri nel Cestino:</h2>
                {trashedBooks.map((book) => (
                  <Link key={book._id} to={`/trashed/${book._id}`}>
                    <p className="book">{book.title}</p>
                  </Link>
                ))}
              </>
            ) : (
              <h2>Effettua il Login per accedere al Cestino</h2>
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

                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  // Crea un button per ogni indice dell'array
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={pagination.page === i + 1 ? 'current-page-button' : ''}
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

        <div className="book-details">
          <Outlet />
        </div>

      </div>
    </>
  )
});

export default Book