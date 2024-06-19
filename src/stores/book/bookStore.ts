import { useState } from 'react';
import axios from 'axios';

interface Book {
  _id: string;
  title: string;
  ISBN: string;
  author: string;
  is_deleted: boolean;
  // Altri campi dei libri, se presenti
}

export const useBookStore = () => {
  // Dichiarazione esplicita del tipo Book
  const [books, setBooks] = useState<Book[]>([]);
  const [singleBook, setSingleBook] = useState<Book | undefined>(undefined);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const response = await axios.get<Book[]>('http://localhost:3000/book/', {
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

  const fetchSingleBook = async (bookId: string) => {
    try {
      const token = localStorage.getItem('token');
      console.log('GOT TOKEN');
      
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const response = await axios.get<Book>(`http://localhost:3000/book/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("GOT RESPONSE");

      setSingleBook(response.data);
      // console.log('Single Book:', response.data);
      console.log('singleBook:', singleBook);
    } catch (error) {
      console.error(`Failed to fetch book with ID ${bookId}:`, error);
    }
  };

  return {
    books,
    singleBook,
    setBooks,
    fetchBooks,
    fetchSingleBook,
  };
};