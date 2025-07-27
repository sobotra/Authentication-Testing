import api from "./axiosConfig";

export const registerUser = (userData) => api.post("/auth/register", userData);
export const verifyEmail = (email, code) =>
  api.post("/auth/verify-email", { email, code });
export const loginUser = (credentials) => api.post("/auth/login", credentials);
export const logoutUser = () => api.post("/auth/logout");
export const getCurrentUser = () => api.get("/auth/me");
export const requestPasswordReset = (email) =>
  api.post("/auth/forgot-password", { email });
export const resetPassword = (data) => api.post("/auth/reset-password", data);

// Export the axios instance directly
export { api };

// Default export for convenience
export default {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  getCurrentUser,
  requestPasswordReset,
  resetPassword,
  api, // Include api in default export if needed
};
