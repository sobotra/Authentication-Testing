const { ipKeyGenerator } = require("express-rate-limit");

module.exports = {
  // Email verification and password reset
  emailVerification: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: "Too many verification attempts. Please try again later.",
    skipSuccessfulRequests: true,
    keyGenerator: (req) => {
      const ip = ipKeyGenerator(req); // Properly handles IPv6 addresses
      return `${ip}:${req.body.email}`;
    },
  },

  // Login attempts
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: "Too many login attempts. Account temporarily locked.",
    skipSuccessfulRequests: true,
    keyGenerator: ipKeyGenerator, // Use built-in IP key generator
    handler: (req, res) => {
      res.status(429).json({
        status: "fail",
        message: "Too many login attempts. Please try again in 15 minutes.",
        retryAfter: 15 * 60, // 15 minutes in seconds
      });
    },
  },

  // API endpoints
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests from this IP. Please try again later.",
    keyGenerator: ipKeyGenerator, // Use built-in IP key generator
  },

  // Critical endpoints (password reset, etc.)
  critical: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 5,
    message: "Too many attempts. Please try again tomorrow.",
    keyGenerator: (req) => {
      const ip = ipKeyGenerator(req); // Properly handles IPv6 addresses
      return `${ip}:${req.path}`; // Include path in key for more granularity
    },
  },
};
