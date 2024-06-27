import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './stores/auth/AuthProvider.tsx';
import Login from './components/Login.tsx';
import Book from './components/Book.tsx';
import EditBook from './components/EditBook.tsx';
import AddBook from './components/AddBook.tsx';
import SingleBook from './components/SingleBook.tsx';
import TrashedBooks from './components/TrashedBooks.tsx';
import SingleTrashedBook from './components/SingleTrashedBook.tsx';
import './assets/css/index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BookProvider } from './stores/book/BookProvider.tsx';

const router = createBrowserRouter([

  // Root
  {
    path: "/",
    element: (
        <BookProvider>
          <App />
        </BookProvider>
    ),
    children: [

      {
        index: true,
        element: <Login /> // Renderizza "Logim" per il percorso "/"
      },

      // Book
      {
        path: "/books",
        element: (
          // Avvolgiamo le rotte nel contesto
            <BookProvider>
              <Book />
            </BookProvider>
        ),
        children: [
          {
            path: ":bookID",
            element: (
              <BookProvider>
                <SingleBook />
              </BookProvider>
            ),
          },
          {
            path: ":bookID/edit",
            element: (
              <BookProvider>
                <EditBook />
              </BookProvider>
            ),
          },
          {
            path: "add",
            element: (
              <BookProvider>
                <AddBook />
              </BookProvider>
            ),
          },
        ],
      },

      // Trashed
      {
        path: "/trashed",
        element: (
            <BookProvider>
              <TrashedBooks />
            </BookProvider>
        ),
        children: [
          {
            path: ":bookID",
            element: (
              <BookProvider>
                <SingleTrashedBook />
              </BookProvider>
            ),
          },
        ],
      },
    ]
  },

  // Book
  {
    path: "/books",
    element: (
      // Avvolgiamo le rotte nel contesto
        <BookProvider>
          <Book />
        </BookProvider>
    ),
    children: [
      {
        path: ":bookID",
        element: (
          <BookProvider>
            <SingleBook />
          </BookProvider>
        ),
      },
      {
        path: ":bookID/edit",
        element: (
          <BookProvider>
            <EditBook />
          </BookProvider>
        ),
      },
      {
        path: "add",
        element: (
          <BookProvider>
            <AddBook />
          </BookProvider>
        ),
      },
    ],
  },

  // Trashed
  {
    path: "/trashed",
    element: (
        <BookProvider>
          <TrashedBooks />
        </BookProvider>
    ),
    children: [
      {
        path: ":bookID",
        element: (
          <BookProvider>
            <SingleTrashedBook />
          </BookProvider>
        ),
      },
    ],
  },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
