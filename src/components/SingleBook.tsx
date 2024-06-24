import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useBookStore } from '../stores/book/useBookStore';
import { useAuthStore } from "../stores/auth/useAuthStore";
import { observer } from "mobx-react-lite";

const SingleBook = observer(() => {
  const { bookID } = useParams<{ bookID?: string }>();
  const { fetchSingleBook, singleBook } = useBookStore();
  const { loginStatus } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (bookID) {
      console.log(`BookID Changed ${bookID}`);

      fetchSingleBook(bookID);
    }
  },

    [bookID, fetchSingleBook]);

  return (
    <>
      <div>
        <h1>SingleBook.tsx</h1>

        {loginStatus ? (
          <>
            {/* Messaggio di stato */}
            {location.state?.message &&
              <div className="card">
                <p style={{ color: 'green' }}>{location.state.message}</p>
              </div>
            }

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
            <Link to={`/books/${bookID}/edit`}><button>Modifica</button></Link>
          </>
        ) : (
          <h2>Effettua il Login per accedere ai dettagli del libro</h2>
        )}
      </div>
    </>

  )
});

export default SingleBook;