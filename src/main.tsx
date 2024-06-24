import React
  from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './stores/auth/AuthProvider.tsx';
import Book from './components/Book.tsx';
import EditBook from './components/EditBook.tsx';
import SingleBook from './components/SingleBook.tsx';
import './assets/css/index.css';
import { BookProvider } from './stores/book/BookProvider.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
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
      }
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
