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

### Creiamo il Provider in cui useremo il Contesto creato

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

Se il componente necessita di essere ri-renderizzato, wrappiamolo nell'observer() di MobX.
observer() è un'utility fornita da MobX che rende i componenti React reattivi ai cambiamenti degli stati osservabili. Quando un componente è wrappato con observer, esso si re-renderizza automaticamente ogni volta che uno degli stati osservabili utilizzati all'interno del componente cambia.

```ts
// Altri import
import { observer } from 'mobx-react-lite';

// Wrappiamo il componente cob observer()
const Book = observer(() => {

  // Logica

  return (
    <>
      // Markup
    </>
  )
});

export default Book
```

runInAction è una funzione di MobX utilizzata nello store per raggruppare una serie di modifiche di stato in una singola azione. Questo è utile per garantire che tutte le modifiche vengano applicate insieme e che i componenti osservabili vengano ri-renderizzati solo una volta alla fine dell'azione, piuttosto che per ogni singola modifica.

```ts
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
      setBooks: action,
      fetchBooks: action,
      fetchSingleBook: action,
      updateBook: action,
    });
  }

  setBooks(books: Book[] | []) {
    this.books = books;
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

      // runInAction
      runInAction(() => {
        this.books = response.data.docs;
        this.pagination = response.data;
      });
      console.log('this nbooks:', this.books);

    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };

  // Altra logica

}

const bookStore = new BookStore();
export default bookStore;
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
  // Root
  {
    path: "/",
    element: <App />,
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

MUI
```ts
{/* Diciamo a MUI di wrappare il bottone con il componente Link e diamo il valore di to="*/}
<Button variant="contained" component={Link} to="/books/add">Aggiungi un nuovo libro</Button>
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

## Paginazione

Nello store creiamo una interfaccia rappresentante la response contenente la paginazone:

```ts
import { useState } from 'react';
import axios from 'axios';

interface Book {
  // Codice
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

  // Creiamo uno State per gestire la paginazione di tipo PaginatedBooks
  const [pagination, setPagination] = useState<PaginatedBooks | undefined>(undefined);

  // Inseriamo i parametri necessari alla query
  const fetchBooks = async (page: number = 1, pageSize: number = 10) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      // Ci aspettiamouna response di tipo PaginatedBooks (descritta nell'interfaccia)
      const response = await axios.get<PaginatedBooks>(`http://localhost:3000/book?page=${page}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Books:', response.data);
      setBooks(response.data.docs);

      // Settiamo il valore di pagination
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

  // Altra logica

  return {
    books,
    singleBook,
    pagination, // Esportiamo la paginazione
    setBooks,
    fetchBooks,
    fetchSingleBook,
    updateBook,
  };
};
```

Nel componente:

```ts
// Altri import
import { useBookStore } from '../stores/book/bookStore';

function Book() {
  // Importiamo pagination
  const { books, fetchBooks, setBooks, pagination } = useBookStore();
  
  // Altra logica

  // Gestiamo il cambio di pagina al click dei pulsanti di Paginazione
  const handlePageChange = (newPage: number) => {
    // fetchBooks accetta i seguenti parametri: const fetchBooks = async (page: number = 1, pageSize: number = 10)
    // Chiama fetchBooks con il nuovo numero di pagina, lasciando pageSize al suo default di 10
    fetchBooks(newPage);
  };

  return (
    <>

      // Markup...

      <div>
        {/* Paginazione */}
        {pagination && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(pagination.prevPage!)}
              // Se non è presente una Prev Page è disabilitato
              disabled={!pagination.hasPrevPage}
            >
              Previous
            </button>

            {/* Array.from crea un array di lunghezza pagination.totalPages. */}
            {/* { length: pagination.totalPages } specifica la lunghezza dell'array, che è il numero totale di pagine disponibili. */}
            {/* _ è usato come convenzione per indicare un parametro che non verrà utilizzato nella mapFn di Array.from() */}
            {/* i: è il secondo parametro della funzione di mappatura. Rappresenta l'indice dell'elemento corrente nell'array generato da Array.from */}
            {/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from */}
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              // Crea un button per ogni indice dell'array
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                disabled={pagination.page === i + 1}
              >
                {i + 1}
              </button>
            ))}
                
            <button
              onClick={() => handlePageChange(pagination.nextPage!)}
              // Se non è presente una Next Page è disabilitato
              disabled={!pagination.hasNextPage}
            >
              Next
            </button>

          </div>
        )}
      </div>

      // Markup...
    </>
  )
}

export default Book
```

## Validation

Importiamo AxiosError
```ts
import axios, { AxiosError } from 'axios';
```

Modifichiamo il metodo
```ts
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Logica
    } catch (error) {
      console.error('Failed to update book:', error);

      // Verifica se l'errore è un oggetto AxiosError e contiene dettagli di validazione
      if (axios.isAxiosError(error)) {
        // Converte 'error' nel tipo AxiosError con un oggetto di risposta che contiene un array di stringhe nella proprietà 'message'.
        const axiosError = error as AxiosError<{ message: string[] }>;
        if (axiosError.response?.data && axiosError.response.data.message) {
          const validationError = axiosError.response.data.message;
          setValidationError(`Errore durante l'aggiornamento del libro: ${validationError}`);
        }
      } else {
        setValidationError(`Errore durante l'aggiornamento del libro: ${error}`);
      }
    }
  };
```

## MUI DataGrid
***src\components\BookGrid.tsx***
```ts
// ALTRI IMPORT

// IMPORTIAMO DATAGRID E IL TIPO DI DEFINIZIONE DELLE COLONNE
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const Book = observer(() => {

  const { books, bookID, fetchBooks, setBooks, pagination } = useBookStore();

  // Definiamo le colonne
  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Titolo', headerAlign: 'center',  flex: 2 },
    { field: 'author', headerName: 'Autore', headerAlign: 'center', flex: 2 },
    { field: 'ISBN', headerName: 'ISBN', headerAlign: 'center', align: 'center', flex: 1 },
    { field: 'loaned_to', headerName: 'Affittato a', headerAlign: 'center', align: 'center', flex: 1 }
  ];

  // Mappiamo i dati nelle righe
  const rows = books.map((book) => ({
    id: book._id,
    title: book.title,
    author: book.author,
    ISBN: book.ISBN,
    loaned_to: book.loaned_to?.name || 'Disponibile'
  }));

  return (
    <>
    // MARKUP
      <div>
        // UTILIZZIAMO IL COMPONENTE ASSEGNANDO I VALORI DI RIGHE E COLONNE
        <DataGrid rows={rows} columns={columns}/>
      </div>
    </>
  )
});
```

paginationModel è un oggetto che contiene la pagina iniziale e la dimensione di default della pagina. Viene inizializzato con i valori ***{ page: 0, pageSize: 100 }***.

E' possibile inizializzarlo con dei valori personalizzati usando la proprietà ***initialState***.
```ts
<DataGrid
  rows={rows}
  columns={columns}
  initialState={{
    pagination: {
      // STATO INIZIALE paginationModel
      paginationModel: { pageSize: 10, page: 0 },
      }, 
  }}
  pageSizeOptions={[10, 20, 30, 40]} // OPZIONI MENU' TENDINA PAGESIZE (DEFAULT [25, 50, 100])
  autoHeight // ALTEZZA AUTOMATICA DELLA TABELLA
/>
```

E' possibile anche controllare il paginationModel tramite useState

```ts
const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  return (
    <>
      <div>
        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 20, 30, 40]}
          autoHeight
        />
      </div>
    </>
  )
});
```

Importando il tipo GridCellParams è possibile leggere i valori delle celle

```ts
import { GridColDef, DataGrid, GridCellParams } from "@mui/x-data-grid";

const handleCellClick = (params: GridCellParams) => {
  console.log(params.value);
};

<DataGrid
  rows={rows}
  columns={columns}
  initialState={{
  pagination: {
    paginationModel: { pageSize: 10, page: 0 },
    },
  }}
  pageSizeOptions={[10, 20, 30, 40]}
  autoHeight
  onCellClick={handleCellClick}
/>
```

## MUI FORM SELECT

E' possibile mappare normalmente i Select di MUI per popolarne i campi

In questo caso abbiamo creato una funzione che accetta due parametri: un array di oggetti e una prop in modo che la funzione possa estrarre dall'array di oggetti gli elementi che possiedono la prop richiesta. Questo ci permette di poter usare la stessa funzione per filtrare proprietà diverse (autore, titolo, ecc in questo esempio).

```ts
// T è il TYpe generico di TS. K è la chiave di T, che quindi può essere solo un oggetto
// T[K][] = l'array risultante sarà di tipo T[K]
const filterParameter = <T extends object, K extends keyof T>(prop: K, objArr: T[]): T[K][] => {
  return [...new Set(objArr.map(obj => obj[prop]))].sort();
};
```

```ts
<FormControl fullWidth>
  <InputLabel id="author-select">Autore</InputLabel>

    <Select
      labelId="author-select"
      id="author-filter"
      value={author}
      label="Autore"
      onChange={(e) => setAuthor(e.target.value)}
    >
      <MenuItem value={''}>Tutti i Libri</MenuItem>

      {filterParameter('author', books).map((value, i) => (
        <MenuItem key={i} value={value}>{value}</MenuItem>
      ))}

      </Select>

</FormControl>
```

Il select quando usato tramite useState cambia il valore di ***author***.
```ts
const [author, setAuthor] = useState('');
```

Una volta che il valore di ***author*** cambia, ***useEffect*** filtrerà i libri tramite Autore
```ts
useEffect(
  () => {
    if (author) {
      console.log(`Current Author is ${author}`);

      const filteredBooks = books.filter((book) => book.author == author)

      console.log(`Filtered Books: ${JSON.stringify(filteredBooks, null, 2)}`);

    }
  }, [author, books]);
```

Aggiungiamo una condizione che permetta però di usare l'array di libri originale se non è stato selezionato alcun Autore.
```ts
const filteredBooks = author
  ? books.filter((book) => book.author === author)
  : books;
```

In questo modo, mappando adesso ***filteredBooks*** e non ***books*** nella constante ***rows*** abbiamo la possibilità di popolare dinamicamente la griglia a seconda del filtro.
```ts
const rows = filteredBooks.map((book) => ({
  id: book._id,
  title: book.title,
  author: book.author,
  ISBN: book.ISBN,
  loaned_to: book.loaned_to?.name || 'Disponibile'
}));
```