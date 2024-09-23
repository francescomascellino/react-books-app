import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { useBookStore } from '../stores/book/useBookStore';
import { useAuthStore } from '../stores/auth/useAuthStore';
import {
  Link, Outlet, useLocation,
  useNavigate
} from 'react-router-dom';
import '../assets/css/book.css'

import Pagination from '@mui/material/Pagination';
// The Stack component manages the layout of its immediate children along the vertical or horizontal axis, with optional spacing and dividers between each child.
import Stack from '@mui/material/Stack';
import SnackBar from './Snackbar';

// Wrappiamo il componente cob observer()
const Book = observer(() => {
  const { trashedBooks, fetchTrashed, setBooks, pagination } = useBookStore();
  const { loginStatus } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Se l'utente è loggato effettua la chiamata API
    if (loginStatus) {
      console.log('From TrashedBooks Component. Fetching Trashed Books');
      fetchTrashed();
    } else {
      console.log("From TrashedBooks Component. User must be logged in");
    }

  },
    [loginStatus, fetchTrashed, setBooks]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    event.preventDefault();
    navigate('/trashed');
    fetchTrashed(newPage);
  };

  const [locationMmessage, setLocationStateMessage] = useState<string>(location.state?.message || '');

  useEffect(() => {
    if (location.state && location.state.message) {
      setLocationStateMessage(location.state.message);
    } else {
      setLocationStateMessage('');
    }
  }, [location.state]);

  return (
    <>
      {/* <Navbar /> */}
      <h1>TrashedBooks.tsx</h1>

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
            {/* MUI Pagination */}
            {pagination && loginStatus && (
              <Stack spacing={2}
              >
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={handlePageChange}
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

      {/* Messaggio di stato */}
      <SnackBar AlertText={locationMmessage} setAlertText={setLocationStateMessage} AlertSeverity='success' />
    </>
  )
});

export default Book