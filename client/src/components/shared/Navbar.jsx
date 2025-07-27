import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // Changed from useHistory
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // Changed from useHistory

  const handleLogout = () => {
    logout();
    navigate("/login"); // Changed from history.push
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">KIT Japanese Club</Link>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
