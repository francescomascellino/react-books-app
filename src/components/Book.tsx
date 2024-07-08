import { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useBookStore } from '../stores/book/useBookStore';
import { useAuthStore } from '../stores/auth/useAuthStore';
// import Navbar from './Navbar';
import '../assets/css/book.css'

import Pagination from '@mui/material/Pagination';

// The Stack component manages the layout of its immediate children along the vertical or horizontal axis, with optional spacing and dividers between each child.
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import { runInAction } from 'mobx';


// Wrappiamo il componente cob observer()
const Book = observer(() => {
  const { books, bookID, fetchBooks, setBooks, 
    // setSingleBookId, 
    pagination } = useBookStore();
  const { loginStatus } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  console.log('From Book component. Chechking if there is a Book id: ',bookID);

// SERVE UN MODO PER FAR SI CHE UNA VOLTA RIENTRATI NEL COMPONENTE IL BOOKID SI VUOTI. UNO USE EFFECT NON FUNZIONA
// QUESTA OPERAZIONE NON PUO' ESSERE FATTA IN BOOKSTORE-FETCHBOOKS PERCHE' SERVE CHE IL LIBRO SELEZIONATO RIMANGA NEI DETTAGLI CAMBIANDO PAGINA
/*   
  useEffect(() => {
    if (bookID !== null || undefined) {
      console.log('you are in the use effect that shoul reset the book id');
      
      setSingleBookId(null)
        console.log(bookID);
    }
        
  },
    // [] MEANS THE EFFECT WILL RUN ONCE AND NEVER AGAIN.
    // [loginStatus] MEANS THE EFFECT WILL RUN EVERY TIME loginStatus CHANGES.
    // WRITE NOTHING (EVEN THE BRACLETS) IF YOU WANT THAT THE EFFECT WILL RUN EVERY TIME THERE IS A CHANGE
    [bookID, setSingleBookId]); 
*/

  useEffect(() => {
    // Se l'utente è loggato effettua la chiamata API
    if (loginStatus) {
      fetchBooks();
    } else {
      // Se l'utente non è loggato svuota la lista dei libri
      // setBooks([]);
      console.log("From Book component UseEffect: User must be logged in");
    }

  },
    // [] MEANS THE EFFECT WILL RUN ONCE AND NEVER AGAIN.
    // [loginStatus] MEANS THE EFFECT WILL RUN EVERY TIME loginStatus CHANGES.
    // WRITE NOTHING (EVEN THE BRACLETS) IF YOU WANT THAT THE EFFECT WILL RUN EVERY TIME THERE IS A CHANGE
    [loginStatus, fetchBooks, setBooks]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    event.preventDefault();
    navigate('/books');
    // fetchBooks accetta i seguenti parametri: const fetchBooks = async (page: number = 1, pageSize: number = 10)
    // Chiama fetchBooks con il nuovo numero di pagina, lasciando pageSize al suo default di 10
    fetchBooks(newPage);

    if (bookID) {
      runInAction(
        () => {
          navigate(`/books/${bookID}`);
        }
      )
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <h1>Book.tsx</h1>
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
              books.length > 0 ? (
                <>
                  <h2>Lista dei libri:</h2>
                  {books.map((book) => (
                    <Link key={book._id} to={`/books/${book._id}`}>
                      <p className="book">{book.title}</p>
                    </Link>
                  ))}
                </>
              ) : (
                <h2>Il Database dei Libri è vuoto!</h2>
              )
            ) : (
              <h2>Effettua il Login per accedere al Database</h2>
            )}

          </div>
          <div>
            {/* MUI Pagination */}
            {pagination && loginStatus && (
              <Stack spacing={2}>
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

          {loginStatus &&
            (
              <div style={{ marginTop: '1rem' }}>
                <Button variant="contained" size="medium" component={Link} to="/books/add" >Aggiungi un nuovo libro</Button>
              </div>
            )}

        </div>

        <div className="book-details">
          <Outlet />
        </div>

      </div>
    </>
  )
});

export default Book