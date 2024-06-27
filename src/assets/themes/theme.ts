import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },

  components: {

    MuiButton: {
      styleOverrides: {
        root: {
          lineHeight: 'inherit',
          textTransform: 'inherit',
          textAlign: "center",
          marginRight: ".5rem"
        },
      },
    }

  }

});

export default darkTheme;