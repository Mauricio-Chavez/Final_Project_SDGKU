import "./navbar.css";

import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <div className="navbar">
      <h1>menu here!</h1>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  );
}

export default Navbar;