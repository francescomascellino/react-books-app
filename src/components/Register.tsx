import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth/useAuthStore';
import '../assets/css/book.css';
import axios, { AxiosError } from 'axios';
import { observer } from 'mobx-react-lite';

const Register = observer(() => {
  const { login, register } = useAuthStore();0
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [surname, SetSurname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassdword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      console.log('user data:', name, surname, username, password);

      const newUser = await register({ name, surname, username, password })

      console.log('new user:', newUser);

      await login(username, password);

      navigate(`/`, { state: { message: 'Utente creato con successo' } });

    } catch (error) {
      console.error('Failed to create new user:', error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string[] }>;
        if (axiosError.response?.data && axiosError.response.data.message) {
          const validationError = axiosError.response.data.message;
          console.log(validationError);
          setValidationError(`Errore durante la creazione dell'utente: ${validationError}`);
        }
      } else {
        setValidationError(`Errore durante la creazione dell'utente: ${error}`);
      }
    }
  };

  return (
    <>
      <div className="edit-book">
        <h1>Register.tsx</h1>
        <>
          <h2>Crea un nuovo utente</h2>
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={3}
                maxLength={50}
                required
              />

              <label htmlFor="surname">Cognome</label>
              <input
                type="text"
                id="surname"
                value={surname}
                onChange={(e) => SetSurname(e.target.value)}
                minLength={3}
                maxLength={50}
                required
              />

              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minLength={3}
                maxLength={50}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassdword(e.target.value)}
                minLength={8}
                maxLength={100}
                required
              />
            </div>

            <div>
              <button type="submit">Conferma</button>
              <Link to="/"><button>Annulla</button></Link>
            </div>
          </form>
          {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
        </>

      </div>
    </>

  )
});

export default Register;
