import React from "react";
import Navbar from "./Navbar";
import Alert from "./Alert";

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="container">
        <Alert />
        {children}
      </div>
    </div>
  );
};

export default Layout; 
