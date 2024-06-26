// import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Link,
  // useNavigate

} from 'react-router-dom';
import { useAuthStore } from '../stores/auth/useAuthStore';

import '../assets/css/navbar.css';

const Navbar = observer(() => {
  const { logout, setLoginStatus, loginStatus } = useAuthStore();
  // const navigate = useNavigate();
  // const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    // setError('');

    if (localStorage.getItem('token') === null) {
      console.log('Token after logout:', localStorage.getItem('token'));
      setLoginStatus(false);
      console.log(`Can login Again? ${loginStatus}`);
    }

    console.log('Logout successful');
    // navigate('/');
  }

  return (
    <nav className="navbar">

      <Link to={"/books"}>Libri</Link>
      <Link to={"/trashed"}>Cestino</Link>

      {/* Mostra il link alla pagina di login se l'utente non è loggato */}
      {!loginStatus ?
        (
          <>
            <div className='user-panel'>
              <Link to={"/"}>Login</Link>
            </div>
          </>
        ) :
        /* Mostra il pulsante logout se l'utente è loggato *//* Mostra il link alla pagina di login se l'utente non è loggato */
        (
          <>
            <div className='user-panel'>
              <span>Benvnuto, {localStorage.getItem('userName')}!</span>
              <a onClick={handleLogout}>Logout</a>
            </div>
          </>
        )
      }

    </nav>
  );
});

export default Navbar;
