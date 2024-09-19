import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, Typography } from "@mui/material";
import { GridColDef, DataGrid, GridCellParams } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth/useAuthStore";
import { useBookStore } from "../stores/book/useBookStore";

const BookGrid = observer(() => {

  const { books, fetchBooks
  } = useBookStore();
  const { loginStatus } = useAuthStore();

  useEffect(() => {

    // Se l'utente è loggato effettua la chiamata API
    if (loginStatus) {
      fetchBooks(1, 100);
    } else {
      // Se l'utente non è loggato svuota la lista dei libri
      // setBooks([]);
      console.log("From Book component UseEffect: User must be logged in");
    }
  },

    [loginStatus, fetchBooks]);

  const [author, setAuthor] = useState('');

  useEffect(
    () => {
      if (author) {
        console.log(`Current Author is ${author}`);
        const filteredBooks = books.filter((book) => book.author == author)
        console.log(`Filtered Books: ${JSON.stringify(filteredBooks, null, 2)}`);

      }
    }, [author, books]);

  // T è il TYpe generico di TS. K è la chiave di T, che quindi può essere solo un oggetto
  // T[K][] = l'array risultante sarà di tipo T[K]
  const filterParameter = <T extends object, K extends keyof T>(prop: K, objArr: T[]): T[K][] => {
    return [...new Set(objArr.map(obj => obj[prop]))].sort();
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Titolo', headerAlign: 'center', flex: 2 },
    { field: 'author', headerName: 'Autore', headerAlign: 'center', flex: 2 },
    { field: 'ISBN', headerName: 'ISBN', headerAlign: 'center', align: 'center', flex: 1 },
    { field: 'loaned_to', headerName: 'Affittato a', headerAlign: 'center', align: 'center', flex: 1 }
  ];

  const filteredBooks = author
    ? books.filter((book) => book.author === author)
    : books;

  const [loansToggle, setLoanedToggle] = useState(false);

  const handleLoanedToggleChange = () => { setLoanedToggle(!loansToggle) };

  /*   const rows = filteredBooks.map((book) => ({
      id: book._id,
      title: book.title,
      author: book.author,
      ISBN: book.ISBN,
      loaned_to: book.loaned_to?.name || 'Disponibile'
    })); */

  const rows = filteredBooks
    // Se è vero che toggle è false (!toggle) allora non applica filtri effettivi 
    // oppure (||) se toggle è true si verifica la seconda condizione in cui vengono filtrati i libri in base alla presenza del un nome di un affittuario
    .filter((book) => !loansToggle || (loansToggle && book.loaned_to?.name))
    .map((book) => ({
      id: book._id,
      title: book.title,
      author: book.author,
      ISBN: book.ISBN,
      loaned_to: book.loaned_to?.name || 'Disponibile'
    }));

  // TEST TO READ A CELL VALUE
  const handleCellClick = (params: GridCellParams) => {
    console.log(params.value);
  };

  return (
    <>
      <div>
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold' }}>
          DataGrid Libri
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', my: 4 }}>

          <FormControl fullWidth size="small" variant="outlined">

            <InputLabel id="author-select">Autore</InputLabel>

            <Select
              labelId="author-select"
              id="author-filter"
              value={author}
              label="Autore"
              onChange={(e) => setAuthor(e.target.value)}
              fullWidth
            >
              <MenuItem value={''}>Tutti i Libri</MenuItem>
              {filterParameter('author', books).map((value, i) => (
                <MenuItem key={i} value={value}>{value}</MenuItem>
              ))}
            </Select>

          </FormControl>

          {/* Assegna labels a componenti switch, radio e checkboxes */}
          <FormControlLabel
            control={
              <Switch
                size="small"
                color="warning"
                checked={loansToggle}
                onChange={handleLoanedToggleChange}
              />
            }

            label={
              // ASeegna stile al font della label e margine sx dallo switch
              <Typography align="left" sx={{ fontSize: 'small', ml: 2 }}>
                Mostra assegnati</Typography>
            }

            // Margine SX SWITCH
            sx={{ ml: 2 }}
          />

        </Box>

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
      </div>
    </>
  )
});

export default BookGrid