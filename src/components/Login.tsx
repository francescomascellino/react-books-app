
import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/auth/useAuthStore';
import { observer } from 'mobx-react-lite';
import { Button } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

const Login = observer(() => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { login, logout, setLoginStatus, loginStatus } = useAuthStore();

  // const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setLoginStatus(true); // Imposta loginStatus su true se c'è un token in localStorage
      console.log(`User ${localStorage.getItem('userName')} is already logged in with Token:`, localStorage.getItem('token'));

    }
  }, [setLoginStatus]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login(username, password);
      console.log('Login successful');

      console.log('Token after login:', localStorage.getItem('token'));

      setUsername(''); // Svuota il campo username
      setPassword(''); // Svuota il campo password
      setError(''); // Svuota il error

      if (localStorage.getItem('token') !== null) {
        // setLoginStatus(true)
        console.log(`Can login Again? ${loginStatus}`);
      }
      // navigate('/books');
    } catch (error) {
      console.error('Login failed:', error);
      setError(`${error}`);
    }
  };

  const handleLogout = () => {
    logout();
    setError('');

    if (localStorage.getItem('token') === null) {
      console.log('Token after logout:', localStorage.getItem('token'));
      // setLoginStatus(false);
      console.log(`Can login Again? ${loginStatus}`);
    }

    console.log('Logout successful');

  }

  return (
    <>
      <h1>Login.tsx</h1>
      <hr />
      <div>

        <form action="" onSubmit={handleLogin}>

          {/* Mostra il form di login se l'utente non è loggato */}
          {!loginStatus &&
            (<>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id='username' value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </>

            )
          }

          <div>
            {/* Mostra il pulsante login se l'utente non è loggato */}
            {!loginStatus &&
              (
                <>
                  <Button type="submit" variant="contained" size="medium">Login</Button>
                </>
              )
            }

            {/* Mostra il pulsante logout se l'utente è loggato */}
            {loginStatus &&
              (
                <>
                  <h1>Benvnuto, {localStorage.getItem('userName')}!</h1>
                  <Button variant="contained" size="medium" color='error' onClick={handleLogout}>Logout</Button>
                </>
              )
            }
          </div>

        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

      </div>
    </>
  )
});

export default Login