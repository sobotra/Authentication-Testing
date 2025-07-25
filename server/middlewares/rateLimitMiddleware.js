const rateLimit = require("express-rate-limit");
const {
  emailVerification,
  login,
  api,
  critical,
} = require("../config/rateLimits");

const emailRateLimiter = rateLimit(emailVerification);
const loginRateLimiter = rateLimit(login);
const apiRateLimiter = rateLimit(api);
const criticalRateLimiter = rateLimit(critical);

module.exports = {
  emailRateLimiter,
  loginRateLimiter,
  apiRateLimiter,
  criticalRateLimiter,
};
