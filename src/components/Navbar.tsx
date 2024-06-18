import { Link } from 'react-router-dom';
import '../assets/css/navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to={"/"}>Home</Link>
      <Link to={"/books"}>Books</Link>
    </nav>
  );
}

export default Navbar;
