
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  

  return (
    <nav>
      <div className="nav-container">
        <Link to="/">Movie App</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/movies">Movies</Link>
          <Link to="/tv">TV Series</Link>
          <Link to="/search">Search</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/account">Account</Link>
              <Link to="/favorites">Favorites</Link>
              <Link to="/watchlater">Watch Later</Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;