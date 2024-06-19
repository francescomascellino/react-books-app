
import { Dispatch, SetStateAction, useState } from 'react';
// import authStore from '../stores/auth/authStore';
import { useAuthStore } from '../stores/auth/useAuthStore';

interface LoginProps {
  setLoginCheck: Dispatch<SetStateAction<boolean>>;
  loginCheck: boolean;
}

function Login({ setLoginCheck, loginCheck }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  // const [loginCheck, setLoginCheck] = useState(false)

  const { login, logout } = useAuthStore();

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
        // console.log('Token from AuthStore:', authStore.token);
        setLoginCheck(true)
        console.log(`Can login Again? ${loginCheck}`);
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
      setLoginCheck(false)
      console.log(`Can login Again? ${loginCheck}`);
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
          {!loginCheck &&
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
            {!loginCheck &&
              (<button type="submit" >Login</button>)
            }

            {/* Mostra il pulsante logout se l'utente è loggato */}
            {loginCheck &&
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