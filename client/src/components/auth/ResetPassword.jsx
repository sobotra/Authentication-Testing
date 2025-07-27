import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Changed from useHistory
import { resetPassword } from "../../api/auth";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Changed from useHistory
  const location = useLocation();

  React.useEffect(() => {
    if (location.state?.email) {
      setFormData((prev) => ({ ...prev, email: location.state.email }));
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(formData);
      setSuccess(
        "Password reset successfully. You can now login with your new password."
      );
      setError("");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
      setSuccess("");
    }
  };

  return (
    <div className="auth-form">
      <h2>Reset Password</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Verification Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            minLength="6"
            maxLength="6"
            required
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            minLength="8"
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            minLength="8"
            required
          />
        </div>
        <button type="submit" className="btn-primary">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
