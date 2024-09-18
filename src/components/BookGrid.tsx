import { Typography } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useAuthStore } from "../stores/auth/useAuthStore";
import { useBookStore } from "../stores/book/useBookStore";

const BookGrid = observer(() => {
  const { books, fetchBooks
  } = useBookStore();
  const { loginStatus } = useAuthStore();

  useEffect(() => {
    // Se l'utente è loggato effettua la chiamata API
    if (loginStatus) {
      fetchBooks();
    } else {
      // Se l'utente non è loggato svuota la lista dei libri
      // setBooks([]);
      console.log("From Book component UseEffect: User must be logged in");
    }

  },

    [loginStatus, fetchBooks]);

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Titolo', headerAlign: 'center', flex: 2 },
    { field: 'author', headerName: 'Autore', headerAlign: 'center', flex: 2 },
    { field: 'ISBN', headerName: 'ISBN', headerAlign: 'center', align: 'center', flex: 1 },
    { field: 'loaned_to', headerName: 'Affittato a', headerAlign: 'center', align: 'center', flex: 1 }
  ];

  const rows = books.map((book) => ({
    id: book._id,
    title: book.title,
    author: book.author,
    ISBN: book.ISBN,
    loaned_to: book.loaned_to?.name || 'Disponibile'
  }));

  return (
    <>
      <div>
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold' }}>
          DataGrid Libri
        </Typography>

        <DataGrid
          rows={rows}
          columns={columns}
        />
      </div>
    </>
  )
});

export default BookGrid