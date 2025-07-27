import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../../api/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [codeSent, setCodeSent] = useState(false); // Add this state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      setSuccess(
        "Password reset email sent. Please check your inbox for the verification code."
      );
      setError("");
      setCodeSent(true); // Set code sent to true
      // Don't navigate immediately - let user enter the code they received
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
      setSuccess("");
      setCodeSent(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Forgot Password</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!codeSent ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Send Reset Link
          </button>
        </form>
      ) : (
        <button
          onClick={() => navigate("/reset-password", { state: { email } })}
          className="btn-primary"
        >
          Enter Verification Code
        </button>
      )}

      <div className="auth-links">
        <p>
          Remember your password? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
