// import { useCallback, useState } from 'react';
import axios, { AxiosError } from 'axios';
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
  trashedBooks: Book[] = [];
  singleBook: Book | null = null;
  pagination: PaginatedBooks | null = null;
  error: Error | AxiosError | null = null;
  bookID: string | null | undefined = null;

  constructor() {
    makeObservable(this, {
      books: observable,
      bookID: observable,
      singleBook: observable,
      pagination: observable,
      trashedBooks: observable,
      error: observable,
      setBooks: action,
      setSingleBookId: action,
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
    console.log('From BookStore SetBooks. Books Set:', this.books);
  }

  async setSingleBookId(bookID: string | null | undefined) {
    runInAction(() => {
      if (bookID !== undefined || null) {
        console.log('From Bookstore setSingleBookId. Setting Book id to: ', bookID);

        this.bookID = bookID;
      }
      this.bookID = bookID;
    });
    console.log('From BookStore setSingleBookId. Book ID Set:', this.bookID);
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
      console.error('From BookStore. Failed to fetch books:', error);
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
        this.bookID = bookID
      });
      console.log('From BookStore fetchSingleBook. Single Book', this.singleBook);

    } catch (error) {
      runInAction(() => {
        if (error instanceof Error || axios.isAxiosError(error)) {
          this.error = error;
        } else {
          this.error = new Error('Unknown error');
        }
      });
      console.error('From BookStore. Failed to fetch single book:', error);
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
        // Cerca l'indice del libro con l'ID del libro aggiornato nell'array di libri
        const index = this.books.findIndex(book => book._id === bookID);
        if (index > -1) {
          // aggiorna i dati del libro all'indice trovato con i dfati aggiornati
          this.books[index] = response.data;
        }
      });
    } catch (error) {
      runInAction(() => {
        if (error instanceof Error || axios.isAxiosError(error)) {
          this.error = error;
        } else {
          this.error = new Error('Unknown error');
        }
      });
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
      console.log('Fom BookStore addBook. Book added:', newBook);

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

      console.log('Fom BookStore softDeleteBook. setting BookID to null.');
      this.setSingleBookId(null)

      console.log('Fom BookStore softDeleteBook. Book soft deleted with ID:', bookID);
    } catch (error) {
      console.error('Failed to soft delete book:', error);
      throw error; // Rilancia l'errore per gestirlo nel componente
    }
  };

  fetchTrashed = async (
    page: number = 1, pageSize: number = 10
  ) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const response = await axios.get(`http://localhost:3000/book/delete??page=${page}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      runInAction(() => {
        this.trashedBooks = response.data.docs;
        console.log('From BookStore fetchTrashed. Trashed Books:', this.trashedBooks);

        this.pagination = response.data;
      });
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };

  fetchSingleSoftDeletedBook = async (bookID: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      runInAction(() => {
        this.singleBook = null;
      })

      const response = await axios.get<Book>(`http://localhost:3000/book/delete/${bookID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      runInAction(() => {
        this.singleBook = response.data;
      });
      console.log('From BookStore fetchSingleSoftDeletedBook. Single Trashed Book', this.singleBook);

    } catch (error) {
      runInAction(() => {
        if (error instanceof Error || axios.isAxiosError(error)) {
          this.error = error;
        } else {
          this.error = new Error('Unknown error');
        }
      });
      console.error('Failed to fetch single trashed book:', error);
    }
  };

  restoreBook = async (bookID: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      await axios.patch(`http://localhost:3000/book/restore/${bookID}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Fetch tutti i libri dopo il soft delete
      await this.fetchTrashed();

      console.log('From BookStore restoreBook. Book restored with ID:', bookID);
    } catch (error) {
      console.error('Failed to restore book:', error);
      throw error; // Rilancia l'errore per gestirlo nel componente
    }
  };

  deleteBook = async (bookID: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      await axios.delete(`http://localhost:3000/book/delete/${bookID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Fetch tutti i libri dopo il soft delete
      await this.fetchTrashed();

      console.log('From BookStore deleteBook. Book deleted with ID:', bookID);
    } catch (error) {
      console.error('Failed to delete book:', error);
      throw error; // Rilancia l'errore per gestirlo nel componente
    }
  };

  clearError = () => {
    runInAction(() => {
      this.error = null;
    });
  };

}

const bookStore = new BookStore();
export default bookStore;
