import { useState } from 'react';
import axios from 'axios';

interface Book {
  _id: string;
  title: string;
  ISBN: string;
  author: string;
  is_deleted?: boolean; // Campo opzionale
  loaned_to?: {
    _id: string;
    name: string;
  } | null; // Campo opzionale
}

interface PaginatedBooks {
  docs: Book[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export const useBookStore = () => {
  // Dichiarazione esplicita del tipo Book
  const [books, setBooks] = useState<Book[]>([]);
  const [singleBook, setSingleBook] = useState<Book | undefined>(undefined);
  const [pagination, setPagination] = useState<PaginatedBooks | undefined>(undefined);

  const fetchBooks = async (page: number = 1, pageSize: number = 10) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const response = await axios.get<PaginatedBooks>(`http://localhost:3000/book?page=${page}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Books:', response.data);
      setBooks(response.data.docs);
      setPagination(response.data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };

  const fetchSingleBook = async (bookId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const response = await axios.get<Book>(`http://localhost:3000/book/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSingleBook(response.data);
      console.log('singleBook:', singleBook);
    } catch (error) {
      console.error(`Failed to fetch book with ID ${bookId}:`, error);
    }
  };

  const updateBook = async (bookId: string, updatedBook: Partial<Book>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const response = await axios.patch<Book>(`http://localhost:3000/book/${bookId}`, updatedBook, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Updated Book:', response.data);
      // Aggiorna il libro nel singleBook o nella lista books, a seconda dell'implementazione
      // Esempio:
      setSingleBook(response.data); // Aggiorna il singleBook con i nuovi dati
      // Oppure:
      const updatedBooks = books.map(book => (book._id === bookId ? response.data : book));
      setBooks(updatedBooks); // Aggiorna la lista dei libri
    } catch (error) {
      console.error(`Failed to update book with ID ${bookId}:`, error);
      throw error; // Rilancia l'errore per gestione futura
    }
  }

  return {
    books,
    singleBook,
    pagination,
    setBooks,
    fetchBooks,
    fetchSingleBook,
    updateBook,
  };
};