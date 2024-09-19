import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField, Typography } from "@mui/material";
import { GridColDef, DataGrid, GridCellParams, GridToolbar } from "@mui/x-data-grid";
import SearchIcon from '@mui/icons-material/Search';
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

  const [loansToggle, setLoanedToggle] = useState(false);

  const handleLoanedToggleChange = () => { setLoanedToggle(!loansToggle) };

  const [searchTitle, setSearchTitle] = useState('');

  const filteredBooks = author
    ? books.filter((book) => book.author === author)
    : books;
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

    // Filtro sui libri che contengono la query di ricerca
    .filter((book) => !searchTitle || book.title.toLowerCase().includes(searchTitle.trim().toLowerCase()))

    .map((book) => (
      {
        id: book._id,
        title: book.title,
        author: book.author,
        ISBN: book.ISBN,
        loaned_to: book.loaned_to?.name || 'Disponibile'
      }
    )
    );

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

        <Box sx={{ display: 'flex', mt: 4, mb: 2, px: 1 }}>

          {/* SELECT AUTHOR */}
          <FormControl fullWidth size="small" variant="outlined">

            <InputLabel id="author-select">Seleziona un Autore</InputLabel>

            <Select
              labelId="author-select"
              id="author-filter"
              value={author}
              label="Seleziona un Autore"
              onChange={(e) => setAuthor(e.target.value)}
              fullWidth
            >
              <MenuItem value={''}>Tutti gli Autori</MenuItem>
              {filterParameter('author', books).map((value, i) => (
                <MenuItem key={i} value={value}>{value}</MenuItem>
              ))}
            </Select>

          </FormControl>

          {/* SWITCH LOANED */}
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
              // Assegna stile al font della label e margine sx dallo switch
              <Typography align="left" sx={{ fontSize: 'small', ml: 2 }}>
                Mostra assegnati</Typography>
            }

            // Margine SX SWITCH
            sx={{ ml: 2 }}
          />

        </Box>

        {/* TITLE SEARCHBAR */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'left', my: 2, px: 1 }}>

          <TextField
            id="search-title"
            onInput={(e) => {
              setSearchTitle((e.target as HTMLInputElement).value);
            }}
            label="Cerca Titolo"
            placeholder="Cerca..."
            size="small"
            fullWidth
          />

          <SearchIcon sx={{ ml: 1 }} />

        </Box>

        {/* DATAGRID */}
        <Box sx={{ px: 1 }}>
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
            slots={{ toolbar: GridToolbar }}
          />
        </Box>

      </div>
    </>
  )
});

export default BookGrid