class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(errors) {
    super("Validation failed", 400);
    this.errors = errors;
  }
}

class AuthError extends AppError {
  constructor(message) {
    super(message, 401);
  }
}

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    // Mongoose validation error
    const errors = Object.values(err.errors).map((el) => el.message);
    return res.status(400).json({
      status: "fail",
      message: "Validation failed",
      errors,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "fail",
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "fail",
      message: "Token expired",
    });
  }

  // Handle our custom errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
  }

  // Unknown errors
  res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};

module.exports = {
  AppError,
  ValidationError,
  AuthError,
  errorHandler,
};
