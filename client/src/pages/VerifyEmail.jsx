import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Changed from useHistory
import { AuthContext } from "../context/AuthContext";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { verifyEmail } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate(); // Changed from useHistory

  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyEmail(email, code);
      navigate("/profile"); // Changed from history.push
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="auth-form">
      <h2>Verify Email</h2>
      <p>We've sent a verification code to {email}</p>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Verification Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            minLength="6"
            maxLength="6"
            required
          />
        </div>
        <button type="submit" className="btn-primary">
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
