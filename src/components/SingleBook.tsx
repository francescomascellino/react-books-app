import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBookStore } from '../stores/book/bookStore';

const SingleBook = () => {
  const { bookID } = useParams();
  const { fetchSingleBook, singleBook } = useBookStore();

  console.log(bookID);
  

  useEffect(() => {
    if (bookID) {
      fetchSingleBook(bookID);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookID]);

  if (!singleBook) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{singleBook.title}</h1>
      <p>Author: {singleBook.author}</p>
      <p>ISBN: {singleBook.ISBN}</p>
    </div>
  );
};

export default SingleBook;