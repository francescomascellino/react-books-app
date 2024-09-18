import { Box, Typography } from '@mui/material';
import '../assets/css/book.css'

const NotFound = () => {

  return (
    <>
      {/* <Navbar /> */}
      <h1>NotFound.tsx</h1>
      <Box className="book-container" display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h2" align="center">
          La pagina selezionata non esiste
        </Typography>
      </Box>
    </>
  )
};

export default NotFound