class OperationalError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends OperationalError {
  constructor(errors) {
    super("Validation failed", 400);
    this.errors = errors;
  }
}

class AuthenticationError extends OperationalError {
  constructor(message = "Authentication failed") {
    super(message, 401);
  }
}

class AuthorizationError extends OperationalError {
  constructor(message = "Unauthorized access") {
    super(message, 403);
  }
}

class RateLimitError extends OperationalError {
  constructor(message = "Too many requests") {
    super(message, 429);
  }
}

const errorHandler = (err, req, res, next) => {
  // Log error for development
  if (process.env.NODE_ENV === "development") {
    console.error("ERROR", {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    err = new AuthenticationError("Invalid token");
  } else if (err.name === "TokenExpiredError") {
    err = new AuthenticationError("Token expired");
  }

  // Handle mongoose validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    err = new ValidationError(errors);
  }

  // Handle mongoose duplicate field errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err = new OperationalError(`${field} already exists`, 400);
  }

  // Send appropriate response
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || "Something went wrong",
    ...(err.errors && { errors: err.errors }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = {
  OperationalError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  RateLimitError,
  errorHandler,
};
