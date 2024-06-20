# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

```bash
npm create vite @latest .
npm install mobx mobx-react-lite
npm install axios
npm install react-router-dom
```

## Creazione di un Context Provider (con mobx)

### 1 Creare lo Store

***authStore.tsx***
```ts
import { action, makeObservable, observable } from "mobx";
import axios from 'axios';

class AuthStore {
  token: string | null = localStorage.getItem('token') || null;
  userName: string | null = localStorage.getItem('userName') || null;
  error: string | null = null;
  loginStatus: boolean = false;

  constructor() {
    makeObservable(
      this,
      {
        token: observable,
        userName: observable,
        login: action.bound,
        logout: action.bound,
        loginStatus: observable,
        setLoginStatus: action.bound
      }
    );
  }

  // AZIONI

  setLoginStatus(value: boolean) {
    this.loginStatus = value;
    return this.loginStatus
  }

  async login(username: string, password: string) {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { username, password });

      console.log(`Username: ${username}, Password: ${password}`);

      const token = response.data.access_token;
      this.token = token;
      localStorage.setItem('token', token);

      this.userName = username;
      localStorage.setItem('userName', this.userName);

      this.error = null;

      console.log('Token from store:', this.token);
      console.log('Username from store:', this.userName);
      return Promise.resolve(this.token);
    } catch (error) {
      localStorage.removeItem('userName');
      this.userName = null;
      localStorage.removeItem('token');
      this.token = null;
      this.error = 'Invalid username or password!';
      console.error('Login failed:', error);
      // throw error;
      return Promise.reject(error);
    }
  }

  logout() {
    this.error = null;
    this.token = null;
    localStorage.removeItem('token');
    this.userName = null;
    localStorage.removeItem('userName');
  }

}

const authStore = new AuthStore();
export default authStore;
```
### Creiamo il contesto

***AuthContext.tsx***
```ts
import { createContext } from "react";
import authStore from "./authStore";

// Definiamo un tipo TypeScript per il contesto dell'autenticazione.
// Questo tipo specifica che il contesto conterrà authStore del tipo authStore.
type AuthContextType = {
  authStore: typeof authStore;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
```

### Creiamo il Provider incui useremoil Contesto creato

***AuthProvider.tsx***
```ts
import React, { ReactNode } from "react";
import AuthContext from "./AuthContext";
import authStore from "./authStore";

// Definiamo ed esportiamo un componente funzionale AuthProvider.
// Questo componente accetta un prop "children" che rappresenta i componenti figli che saranno racchiusi dal provider.
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthContext.Provider value={{ authStore }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Assegniamo il Provider alle componenti che lo utilizzano

In questo caso AuthProvider è richiesto a livello globale, quindi wrapperà l'intera applicazione.

```ts
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Importiamo AuthProvider
import { AuthProvider } from './stores/auth/AuthProvider.tsx'; 

import './assets/css/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Utilizziamo il AuthProvider per avvolgere l'applicazione con il contesto di autenticazione. */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

### Utilizzo del Contesto tramite custom hook

***useAuthStore.tsx***
```ts
import { useContext } from "react";
import AuthContext from "./AuthContext";

// Definiamo ed esportiamo un hook personalizzato chiamato useAuthStore.
// Questo hook utilizza useContext per accedere al contesto dell'autenticazione.
export const useAuthStore = () => {
  // Otteniamo il contesto dell'autenticazione.
  const context = useContext(AuthContext);

   // Se il contesto non è definito, l'hook è stato chiamato al di fuori di un AuthProvider. In questo caso, lanciamo un errore.
  if (!context) {
    throw new Error("useAuthStore must be used within an AuthProvider");
  }

  // Se il contesto è definito, ritorniamo authStore dal contesto.
  return context.authStore;
};
```

### Utilizzo del custom hook useAuthStore

```ts
// Importiamo l'hook
import { useAuthStore } from '../stores/auth/useAuthStore';

function Component() {

// Utilizziamo l'hook per estrarre metodi e variabili dallo store legato al Context Provider
  const { login, logout, setLoginStatus, loginStatus } = useAuthStore();

  // Metodi e logica del componente

  return (
    <>
      // Markup
    </>

  );
}

export default Component;
```

## React Router Dom

```ts

import React from 'react';

// Importiamo le librerie necessarie da React e React Router DOM.
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './stores/auth/AuthProvider.tsx'; 
import Book from './components/Book.tsx';
import EditBook from './components/EditBook.tsx';
import SingleBook from './components/SingleBook.tsx';
import './assets/css/index.css';

// Creiamo l'istanza del router utilizzando createBrowserRouter da React Router DOM.
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

      {/* Utilizziamo RouterProvider per fornire il router creato all'applicazione. */}
      <RouterProvider router={router} />

    </AuthProvider>
  </React.StrictMode>
);
```

### Links
```ts
import { Link } from 'react-router-dom';
import '../assets/css/navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to={"/"}>Home</Link>
      <Link to={"/books"}>Books</Link>
    </nav>
  );
}

export default Navbar;
```

### Links con Outlet

**<Outlet />** viene utilizzato per indicare il punto in cui i componenti figli delle rotte annidate verranno renderizzati. Questo è particolarmente utile quando si definiscono rotte annidate, come nel caso dell'esempio Book che potrebbe avere rotte come ***/books/:bookID*** e ***/books/:bookID/edit***.

```ts
// Importiamo i componenti Link e Outlet da react-router-dom
import { Link, Outlet } from 'react-router-dom';

function Book() {

  // Logica del componente

  return (
    <>
      <div>
        // Utilizziamo il componente Link per creare un collegamento.
        // La prop 'to' specifica il percorso dinamico verso la pagina del libro, utilizzando l'ID del libro come parte dell'URL.
        // Attualmente siamo alla rotta /books, quindi /books/${book._id} è una rotta annidata
        <Link key={book._id} to={`/books/${book._id}`}>
          <p className="book">{book.title}</p>
        </Link>
      </div>

      <div>
        // Outlet viene utilizzato per visualizzare i componenti figli delle rotte annidate
        <Outlet />
      </div>
    </>
  )
}

export default Book
```

### Inviare un utente a un'altra rotta dopo un'operazione

```ts
// Importiamo UseNavigate e useParams (per accedere ai parametri delle rotte)
import { Link, useNavigate, useParams } from 'react-router-dom';

// Altri imports

function EditBook() {
  
  // Logica

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (bookID) {
        await updateBook(bookID, { title, author, ISBN });
        console.log('Book updated successfully');

        // Naviga alla pagina del singolo libro con un messaggio di successo
        navigate(`/books/${bookID}`, { state: { message: 'Libro aggiornato con successo' } });

      } else {
        throw new Error('Libro non trovato');
      }
    } catch (error) {
      console.error('Failed to update book:', error);
    }
  };

  return (
    <>
      // Markup
    </>

  );
}

export default EditBook;
```

### Renderizzare un valore passato come parametro delle rotte
```ts
// Importiamo UseNavigate e useParams (per accedere ai parametri delle rotte)
import { Link, useLocation, useParams } from "react-router-dom";

// Altri imports

function SingleBook() {

  // Logica

  return (
    <>
      // Se location.state.message esiste lo srenderizziamo in pagina
      {location.state?.message &&
        <div className="card">
          <p style={{ color: 'green' }}>{location.state.message}</p>
        </div>
      }
    </>
  );
}

export default SingleBook;
```

## Uso di js-cookie

```bash
npm install js-cookie
```

```ts
import axios from 'axios';
import Cookies from 'js-cookie'; // Importare js-cookie

class AuthStore {
  token: string | null = Cookies.get('token') || null;
  userName: string | null = Cookies.get('userName') || null;
  error: string | null = null;

  async login(username: string, password: string) {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { username, password });

      console.log(response);

      const token = response.data.access_token;
      this.token = token;

      // Set Cookie. Il token scadrà in 7 giorni
      Cookies.set('token', token, { expires: 7 });
      this.userName = username;

      // Set Cookie. Il token scadrà in 7 giorni
      Cookies.set('userName', this.userName, { expires: 7 });

      console.log('Token from store:', this.token);
      console.log('Username from store:', this.userName);

      this.error = null;

    } catch (error) {
      // Remove Cookie
      Cookies.remove('userName');
      this.userName = null;

      // Remove Cookie
      Cookies.remove('token');
      this.token = null;

      console.error('Login failed:', error);
      this.error = 'Invalid username or password!';
      throw error;
    }
  }

  logout() {
    this.error = null;
    this.token = null;
    this.userName = null;

    // Remove Cookie
    Cookies.remove('token');

    // Remove Cookie
    Cookies.remove('userName');
  }
}

const authStore = new AuthStore();
export default authStore;
```