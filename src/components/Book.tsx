
import { useEffect, useState } from 'react'
import axios from 'axios';
import Navbar from './Navbar';

interface Book {
  _id: string;
  title: string;
  // Altri campi dei libri, se presenti
}

interface BookProps {
  loginCheck: boolean;
}

function Book({ loginCheck }: BookProps) {
  // Dichiarazione esplicita del tipo Book[]
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {

    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found in localStorage');
        }

        const response = await axios.get('http://localhost:3000/book/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Books:', response.data);
        setBooks(response.data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    };

    // Se l'utente è loggato effettua la chiamata API
    if (loginCheck) {
      fetchBooks();
    }

    // Se l'utente non è loggato svuota la lista dei libri
    if (!loginCheck) {
      setBooks([]);
    }

  },
    // [] MEANS THE EFFECT WILL RUN ONCE AND NEVER AGAIN.
    // [count] MEANS THE EFFECT WILL RUN EVERY TIME count CHANGES.
    // WRITE NOTHING (EVENT THE BRACLETS) IF YOU WANT THAT THE EFFECT WILL RUN EVERY TIME THERE IS A CHANGE
    [loginCheck]);

  return (
    <>
    <Navbar />
      {/* Rendering dei titoli dei libri */}
      <div>
        <h1>Book.tsx</h1>

        {/* Mostra un titolo diverso a seconda se l'utente sia loggato o meno */}
        {
          loginCheck ? (
            <h2>Lista dei titoli dei libri:</h2>
          ) : <h2>Effettua il Login per accedere alla lista dei libri</h2>
        }

        {books.map(book => (
          <p key={book._id}>{book.title}</p>
        ))}
      </div>

    </>
  )
}

export default Book