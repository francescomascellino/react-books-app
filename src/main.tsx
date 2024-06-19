import React
  //, { useState } 
  from 'react';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
// import App from './App.tsx';
// import { AuthProvider } from './stores/auth/AuthProvider.tsx';
// import Book from './components/Book.tsx';
import './assets/css/index.css';
import Root from './components/Root.tsx';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
