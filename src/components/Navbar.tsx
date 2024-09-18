import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth/useAuthStore';
import { Avatar, Box, Button, FormControlLabel, FormGroup, IconButton, Menu, MenuItem, Switch, Toolbar, Tooltip, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuBookIcon from '@mui/icons-material/MenuBook';

interface NavbarProps {
  themeMode: 'dark' | 'light';
  handleThemeChange: () => void;
}

const pages = [
  { label: 'Libri', path: '/books' },
  { label: 'Cestino', path: '/trashed' }
];

const userMenu = [
  { label: 'Profile', route: '/notfound', needsLogin: true },
  { label: 'Account', route: '/notfound', needsLogin: true },
  { label: 'Dashboard', route: '/notfound', needsLogin: true },
  { label: 'Datagrid', route: '/datagrid', needsLogin: true },
  { label: 'Register', route: '/register', needsLogin: false },
  { label: 'Login', route: '/', needsLogin: false },
  { label: 'Logout', route: '/', needsLogin: true, isLogout: true },
];

const avatarSrc = '';

const Navbar: React.FC<NavbarProps> = observer(({ themeMode, handleThemeChange }) => {
  const { logout, setLoginStatus, loginStatus } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  // const [error, setError] = useState<string | null>(null);

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || '');
  }, [loginStatus]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    // setError('');

    if (localStorage.getItem('token') === null) {
      console.log('Token after logout:', localStorage.getItem('token'));
      setLoginStatus(false);
      console.log(`Can login Again? ${loginStatus}`);
    }

    console.log('location message before reset:', location.state);

    if (location.state?.message) {
      navigate(location.pathname, { state: { ...location.state, message: null } });
    }

    if (location.state?.message) {
      navigate('/', { state: { message: null } });
    } else {
      navigate('/');
    }

    handleCloseUserMenu()
  };

  const handleSwitchChange = () => {
    handleThemeChange();
  };

  return (
    <>
      <Toolbar disableGutters>

        {/* Nav Elements Mobile */}
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>

          {/* Hamburger Mobile */}
          <IconButton
            size="large"
            aria-label="menu items"
            // aria-controls descrive l'elemento a cui è collegato
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon /> {/* Hamburger Icon*/}
          </IconButton>

          {/* Contenuto hamburger Mobile */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >

            {pages.map((page) => (
              <MenuItem key={page.label} onClick={handleCloseNavMenu} component={Link} to={page.path}>
                <Typography textAlign="center">{page.label}</Typography>
              </MenuItem>
            ))}

          </Menu>

        </Box>

        {/* Logo Mobile */}
        <MenuBookIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />

        {/* Titolo Mobile */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            flexGrow: 1,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          Books M
        </Typography>

        {/* Elementi schermi Md in su */}

        {/* Logo  (da MD a salire)*/}
        <MenuBookIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />

        {/* Titolo (da MD a salire)*/}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            mr: 3,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.1rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          Books DB
        </Typography>

        {/* Nav elements da MD a salire */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page) => (
            <Button
              key={page.label}
              component={Link}
              to={page.path}
              sx={{ my: 2, display: 'block' }}
            >
              {page.label}
            </Button>
          ))}
        </Box>

        {/* Pulsante di switch del tema */}
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={themeMode === 'dark'} onChange={handleSwitchChange} />}
            label={themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
          />
        </FormGroup>

        {/* User Menu */}
        <Box sx={{ flexGrow: 0 }}>

          <Tooltip title="Open User Menu">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt={userName} src={avatarSrc}>
                {!avatarSrc && userName ? userName.charAt(0).toUpperCase() : ''}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >

            {userMenu.filter(setting => {
              // Il filtro  esclude 'Login' e 'Register' se l'utente è loggato, e 'Logout' se l'utente è loggato

              if (loginStatus && (setting.label === 'Login' || setting.label === 'Register') || (setting.label === 'Logout' && !loginStatus)) {


                return false; // Esclude queste voci se l'utente è loggato
              }
              return true;
            }).map((setting) => (
              <MenuItem
                key={setting.label}

                // Se il ciclo sta compilando un'opzione "islogout" allora assegna al click la funzione di logout
                onClick={setting.isLogout ? handleLogout : handleCloseUserMenu}

                // La voce del menù è disabled se l'opzione attuale "needsLogin" e l'utente non è loggato
                disabled={(setting.needsLogin && !loginStatus)}

                component={Link}

                // Link indirizza verso la route indicata nell'oggetto newUserMenu
                to={setting.route}
              >
                <Typography textAlign="center">
                  {/* Mostra l'etichetta dell'opzione ciclata */}
                  {setting.label}
                </Typography>
              </MenuItem>
            ))}

          </Menu>

        </Box>
      </Toolbar>

    </>
  );
});

export default Navbar;
