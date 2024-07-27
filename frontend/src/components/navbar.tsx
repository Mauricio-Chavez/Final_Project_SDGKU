import { Button } from "@material-tailwind/react";
import "./navbar.css";

import { Link } from 'react-router-dom';
import useGlobalState from "../context/GlobalState";

const Navbar: React.FC = () => {
  const { logout, token } = useGlobalState();
  return (
    <div className="navbar">
      <h1>menu here!</h1>
      <Link to="/">Home</Link>
      {
        token ? null : <Link to="/login">Login</Link>
      }
      {
        token ? null : <Link to="/register">Register</Link>
      }
      <Link to="/profile">Profile</Link>
      <Link to="/upload-certifications">Upload Certifications</Link>
      <Link to="/bookings">Bookings</Link>
      <Button
        placeholder=''
        color="red"
        onPointerEnterCapture={() => { }}
        onPointerLeaveCapture={() => { }}
        onClick={logout}
      >Logout</Button>
    </div>
  );
}

export default Navbar;