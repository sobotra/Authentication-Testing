const User = require("../models/User");
const Verification = require("../models/Verification"); // Add this line
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");
const verificationCodes = require("../utils/verificationCodes"); // Updated this line
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("./emailService");
const { hashPassword, comparePasswords } = require("../utils/passwordUtils");

const registerUser = async (userData) => {
  const { email, password, confirmPassword, firstName, lastName } = userData;

  // Check if passwords match
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already in use");
  }

  // Create unverified user
  const user = new User({
    firstName,
    lastName,
    email,
    password,
  });

  await user.save();

  // Send verification email
  await sendVerificationEmail(email);

  return {
    message:
      "Verification email sent. Please check your email to complete registration.",
    userId: user._id,
  };
};

const verifyEmail = async (email, code) => {
  const isValid = await verificationCodes.verifyCode(
    email,
    code,
    "email_verification"
  );
  if (!isValid) {
    throw new Error("Invalid or expired verification code");
  }

  const user = await User.findOneAndUpdate(
    { email, isVerified: false },
    { isVerified: true },
    { new: true }
  );

  if (!user) {
    throw new Error("User not found or already verified");
  }

  // Generate tokens for immediate login after verification
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  return {
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email, isVerified: true });

  if (!user) {
    throw new Error("Invalid credentials or email not verified");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  return {
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email, isVerified: true });
  if (!user) {
    throw new Error("No verified user found with this email");
  }

  const code = await verificationCodes.createVerificationRecord(
    email,
    "password_reset"
  );

  await sendPasswordResetEmail(email, code);

  return {
    message: "Password reset email sent",
  };
};

const resetPassword = async (email, code, newPassword, confirmPassword) => {
  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  await verificationCodes.verifyCode(email, code, "password_reset");

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  user.password = newPassword;
  await user.save();

  return { message: "Password updated successfully" };
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error("User not found");
    }

    const newAccessToken = generateAccessToken(user._id, user.role);
    return { accessToken: newAccessToken };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  requestPasswordReset,
  resetPassword,
  refreshAccessToken,
};
