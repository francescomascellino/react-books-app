
import { Dispatch, SetStateAction, useState } from 'react';
import authStore from '../stores/auth/authStore';

interface LoginProps {
  setLoginCheck: Dispatch<SetStateAction<boolean>>;
  loginCheck: boolean;
}

function Login({ setLoginCheck, loginCheck }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  // const [loginCheck, setLoginCheck] = useState(false)

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await authStore.login(username, password);
      console.log('Login successful');
      setUsername(''); // Svuota il campo username
      setPassword(''); // Svuota il campo password
      setError(''); // Svuota il error

      if (authStore.token !== null) {
        // console.log('Token from AuthStore:', authStore.token);
        setLoginCheck(true)
      }

    } catch (error) {
      console.error('Login failed:', error);
      setError(`${authStore.error}`);
    }
  };

  const handleLogout = () => {
    authStore.logout();
    setError('');

    if (authStore.token === null) {
      // console.log('Token from AuthStore:', authStore.token);
      setLoginCheck(false)
    }

    console.log('Logout successful');

  }

  return (
    <>
      <h1>Login Page</h1>
      <div>

        <form action="" onSubmit={handleLogin}>

          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <div>
            {!loginCheck &&
              (<button type="submit" >Login</button>)
            }
            {/* <button type="submit" >Login</button> */}
          </div>

        </form>

        {/* Mostra il pulsante logout se l'utente è loggato */}
        {loginCheck &&
          (<button onClick={handleLogout}>Logout</button>)
        }

        {error && <p style={{ color: 'red' }}>{error}</p>}

      </div>
    </>
  )
}

export default Login