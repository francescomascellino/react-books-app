import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useBookStore } from '../stores/book/bookStore';
import { useAuthStore } from "../stores/auth/useAuthStore";

// interface LoginCheckProps {
//   loginCheck: boolean;
// }

function SingleBook(
  // { loginCheck }: LoginCheckProps
) {
  const { bookID } = useParams();
  const { fetchSingleBook, singleBook } = useBookStore();
  const { loginStatus } = useAuthStore();

  console.log(bookID);


  useEffect(() => {
    if (bookID) {
      fetchSingleBook(bookID);
      console.log(`Book with ID ${bookID}`, singleBook);

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookID]);

  if (!singleBook) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <h1>SingleBook.tsx</h1>

        {loginStatus ? (
          <>
            <div className="card">
              <h2>{singleBook.title}</h2>
              <p>Autore: {singleBook.author}</p>
              <p>ISBN: {singleBook.ISBN}</p>
              {singleBook.loaned_to && <p>Affittato a {singleBook.loaned_to.name}</p>}
            </div>
            <Link to={`/books/${bookID}/edit`}><button>Modifica</button></Link>
          </>
        ) : (
          <h2>Effettua il Login per accedere ai dettagli del libro</h2>
        )}
      </div>
    </>

  );
}

export default SingleBook;