// import { useCallback, useState } from 'react';
import axios from 'axios';
import { action, makeObservable, observable, runInAction } from 'mobx';

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

class BookStore {
  books: Book[] = [];
  singleBook: Book | null = null;
  pagination: PaginatedBooks | null = null;

  constructor() {
    makeObservable(this, {
      books: observable,
      singleBook: observable,
      pagination: observable,
      setBooks: action,
      fetchBooks: action,
      fetchSingleBook: action,
      updateBook: action,
      addBook: action,
      softDeleteBook: action,
    });
  }

  // CONTROLLARE PER RIMOZIONE SE INUTILE
  async setBooks(newBooks: Book[]) {
    runInAction(() => {
      this.books = newBooks;
    });
    console.log('Books Set:', this.books);
  }

  fetchBooks = async (page: number = 1, pageSize: number = 10) => {
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

      runInAction(() => {
        this.books = response.data.docs;
        this.pagination = response.data;
      });
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };

  fetchSingleBook = async (bookID: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      runInAction(() => {
        this.singleBook = null;
      })

      const response = await axios.get<Book>(`http://localhost:3000/book/${bookID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      runInAction(() => {
        this.singleBook = response.data;
      });
      console.log('Single Book', this.singleBook);

    } catch (error) {
      console.error('Failed to fetch single book:', error);
    }
  };

  updateBook = async (bookID: string, updatedBook: Partial<Book>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const response = await axios.patch<Book>(`http://localhost:3000/book/${bookID}`, updatedBook, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      runInAction(() => {
        const index = this.books.findIndex(book => book._id === bookID);
        if (index > -1) {
          this.books[index] = response.data;
        }
      });
    } catch (error) {
      console.error('Failed to update book:', error);
    }
  };

  addBook = async (book: Partial<Book>): Promise<Book> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const response = await axios.post<Book>('http://localhost:3000/book', book, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newBook = response.data;
      console.log('Book added:', newBook);

      runInAction(() => {
        this.books.push(newBook);
      });

      return newBook;

    } catch (error) {
      console.error('Failed to add book:', error);
      throw error; // Rilancia l'errore per gestirlo nel componente
    }
  };

  softDeleteBook = async (bookID: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      await axios.patch(`http://localhost:3000/book/delete/${bookID}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Fetch tutti i libri dopo il soft delete
      await this.fetchBooks();

      console.log('Book soft deleted with ID:', bookID);
    } catch (error) {
      console.error('Failed to soft delete book:', error);
      throw error; // Rilancia l'errore per gestirlo nel componente
    }
  };

}

const bookStore = new BookStore();
export default bookStore;
