
import { useState } from 'react';
import { useAuthStore } from '../stores/auth/useAuthStore';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { login, logout, setLoginStatus, loginStatus } = useAuthStore();

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
        setLoginStatus(true)
        console.log(`Can login Again? ${loginStatus}`);
      }

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
      setLoginStatus(false);
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
              (<button type="submit" >Login</button>)
            }

            {/* Mostra il pulsante logout se l'utente è loggato */}
            {loginStatus &&
              (<button onClick={handleLogout}>Logout</button>)
            }
          </div>

        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

      </div>
    </>
  )
}

export default Login