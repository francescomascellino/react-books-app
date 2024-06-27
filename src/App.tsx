import Navbar from './components/Navbar';
// import Login from './components/Login'
import './assets/css/App.css'
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { darkTheme, lightTheme } from './assets/themes/theme';
import { useEffect, useState } from 'react';
import { CssBaseline } from '@mui/material';

function App() {

  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    // Cerca un tema salvato nel localstorage
    const storedTheme = localStorage.getItem('themeMode');
    // Restituisce 'light' se il tema salvato è 'light', altrimenti 'dark' di default. Di base l'app viene avviata in Dark Mode
    return storedTheme === 'light' ? 'light' : 'dark';
  });

  // All'avvio dell'applicazione controlla se c'è un tema salvato e lo applica
  useEffect(() => {
    const storedTheme = localStorage.getItem('themeMode');
    if (storedTheme) {
      setThemeMode(storedTheme as 'dark' | 'light');
    }
  }, []); // Esegue solo al primo avvio

  const handleThemeChange = () => {
    // Se il tema è dark lo cambia in ligh e viceversa
    const newTheme = themeMode === 'dark' ? 'light' : 'dark';
    // Applica il nuoivo tema
    setThemeMode(newTheme);
    // Salva il nuovo tema nel localstorage
    localStorage.setItem('themeMode', newTheme);
  };

  return (
    <>
      <ThemeProvider theme={themeMode === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        <Navbar themeMode={themeMode} handleThemeChange={handleThemeChange} />
        <Outlet />
      </ThemeProvider >
    </>
  )
}

export default App
