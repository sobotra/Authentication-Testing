const { body, validationResult } = require("express-validator");

const validateRegistration = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

const validateLogin = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateEmailVerification = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("code")
    .isLength({ min: 6, max: 6 })
    .withMessage("Verification code must be 6 digits"),
];

const validatePasswordReset = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("code")
    .isLength({ min: 6, max: 6 })
    .withMessage("Verification code must be 6 digits"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateEmailVerification,
  validatePasswordReset,
  validateRequest,
};
