/* import { createTheme } from '@mui/material/styles';

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

export default darkTheme; */

import { createTheme } from '@mui/material/styles';
import { CSSObject } from '@mui/styled-engine';

const createComponentStyles = (): { [componentName: string]: { styleOverrides?: { [className: string]: CSSObject } } } => ({
  MuiButton: {
    styleOverrides: {
      root: {
        lineHeight: 'inherit',
        textTransform: 'inherit',
        textAlign: 'center',
        marginRight: '.5rem',
      },
    },
  },
});

// Opzioni per il tema
const themeOptions = {
  dark: createTheme({
    palette: {
      mode: 'dark',
    },
    components: createComponentStyles(),
  }),
  light: createTheme({
    palette: {
      mode: 'light',
    },
    components: createComponentStyles(),
  }),
};

const darkTheme = themeOptions.dark;
const lightTheme = themeOptions.light;

export { darkTheme, lightTheme };
