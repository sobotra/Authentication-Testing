import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home-page">
      <h1>Welcome to KIT Japanese Club</h1>
      {user ? (
        <p>You are logged in as {user.email}</p>
      ) : (
        <div className="auth-options">
          <Link to="/login" className="btn-primary">
            Login
          </Link>
          <Link to="/register" className="btn-secondary">
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
