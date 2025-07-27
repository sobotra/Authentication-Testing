import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Alert = () => {
  const { error } = useContext(AuthContext);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (error) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!show || !error) return null;

  return (
    <div className="alert alert-error">
      {error}
      <button onClick={() => setShow(false)}>×</button>
    </div>
  );
};

export default Alert;
