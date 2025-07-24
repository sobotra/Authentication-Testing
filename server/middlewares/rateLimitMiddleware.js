const rateLimit = require("express-rate-limit");

// Rate limiting for email verification and password reset
const emailRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per windowMs
  message: "Too many requests from this IP, please try again after an hour",
  skipSuccessfulRequests: true,
});

// Rate limiting for login attempts
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: "Too many login attempts, please try again later",
  skipSuccessfulRequests: true,
});

module.exports = {
  emailRateLimiter,
  loginRateLimiter,
};
