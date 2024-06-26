import { useEffect } from 'react'
import { observer } from 'mobx-react-lite';
import { useBookStore } from '../stores/book/useBookStore';
import { useAuthStore } from '../stores/auth/useAuthStore';
import {
  Link, Outlet, useLocation,
  useNavigate
} from 'react-router-dom';
import Navbar from './Navbar';
import '../assets/css/book.css'

import Pagination from '@mui/material/Pagination';
// The Stack component manages the layout of its immediate children along the vertical or horizontal axis, with optional spacing and dividers between each child.
import Stack from '@mui/material/Stack';

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

  const muiPageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    event.preventDefault();
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

            {loginStatus ? (
              trashedBooks.length > 0 ? (
                <>
                  <h2>Lista dei libri nel Cestino:</h2>
                  {trashedBooks.map((book) => (
                    <Link key={book._id} to={`/trashed/${book._id}`}>
                      <p className="book">{book.title}</p>
                    </Link>
                  ))}
                </>
              ) : (
                <h2>Il Cestino è vuoto</h2>
              )
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

            {/* MUI Pagination */}
            {pagination && loginStatus && (
              <Stack spacing={2}
              // sx={{ color: 'rgba(255, 255, 255, 0.87)' }}
              >
                <Pagination
                /* 
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'rgba(255, 255, 255, 0.87)',
                      '&.Mui-selected': {
                        backgroundColor: '#535bf2',
                        color: '#fff',
                      },
                      '&:hover': {
                        backgroundColor: '#646cff',
                      },
                    },
                  }}
                   */
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={muiPageChange}
                  showFirstButton
                  showLastButton
                />
              </Stack>
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