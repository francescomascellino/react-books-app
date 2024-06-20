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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/books",
    element: <Book />,
    children: [
      {
        path: ":bookID",
        element: <SingleBook />
      },
      {
        path: ":bookID/edit",
        element: <EditBook />
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
