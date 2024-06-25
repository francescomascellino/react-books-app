import { Link } from 'react-router-dom';
import '../assets/css/navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to={"/"}>Home</Link>
      <Link to={"/books"}>Libri</Link>
      <Link to={"/trashed"}>Cestino</Link>
    </nav>
  );
}

export default Navbar;
