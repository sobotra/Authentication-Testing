const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  emailRateLimiter,
  loginRateLimiter,
} = require("../middlewares/rateLimitMiddleware");
const {
  validateRegistration,
  validateLogin,
  validateEmailVerification,
  validatePasswordReset,
  validateRequest,
} = require("../middlewares/validationMiddleware");

// Public routes
router.post(
  "/register",
  validateRegistration,
  validateRequest,
  authController.register
);

router.post(
  "/verify-email",
  emailRateLimiter,
  validateEmailVerification,
  validateRequest,
  authController.verifyEmail
);

router.post(
  "/login",
  loginRateLimiter,
  validateLogin,
  validateRequest,
  authController.login
);

router.post(
  "/forgot-password",
  emailRateLimiter,
  validateRequest,
  authController.forgotPassword
);

router.post(
  "/reset-password",
  validatePasswordReset,
  validateRequest,
  authController.resetPassword
);

router.post("/refresh", authController.refreshToken);

// Protected routes
router.use(authenticateToken);

router.get("/me", authController.getCurrentUser);
router.post("/logout", authController.logout);

module.exports = router;
