const authService = require("../services/authService");
const User = require("../models/User");
const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === "Email already in use") {
      return res.status(400).json({
        error: "EmailExists",
        message: "This email is already registered",
      });
    }
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const result = await authService.verifyEmail(email, code);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.requestPasswordReset(email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword, confirmPassword } = req.body;
    const result = await authService.resetPassword(
      email,
      code,
      newPassword,
      confirmPassword
    );
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Invalid or expired verification code") {
      return res.status(400).json({
        error: "InvalidCode",
        message: "The verification code is invalid or has expired",
      });
    }
    if (error.message === "Passwords do not match") {
      return res.status(400).json({
        error: "PasswordMismatch",
        message: "New password and confirmation password do not match",
      });
    }
    if (error.message === "User not found") {
      return res.status(404).json({
        error: "UserNotFound",
        message: "No user found with this email address",
      });
    }
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};



const logout = async (req, res, next) => {
   try {
    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
  getCurrentUser,
};
