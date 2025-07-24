const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");
const {
  getVerificationCode,
  deleteVerificationCode,
} = require("../utils/verificationCodes");
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
  const storedCode = getVerificationCode(email);

  if (!storedCode || storedCode.code !== code) {
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

  deleteVerificationCode(email);

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

  await sendPasswordResetEmail(email);

  return { message: "Password reset email sent. Please check your email." };
};

const resetPassword = async (email, code, newPassword, confirmPassword) => {
  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const storedCode = getVerificationCode(email);

  if (!storedCode || storedCode.code !== code) {
    throw new Error("Invalid or expired verification code");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  user.password = newPassword;
  await user.save();

  deleteVerificationCode(email);

  return {
    message:
      "Password updated successfully. You can now login with your new password.",
  };
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
