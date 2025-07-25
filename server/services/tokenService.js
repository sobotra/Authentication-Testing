const jwt = require("jsonwebtoken");
const Token = require("../models/Token");
const User = require("../models/User");
const { AppError } = require("../middlewares/errorMiddleware");

const generateTokens = async (userId, role) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId, role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "15d" }
  );

  // Store refresh token in DB
  await Token.create({
    userId,
    token: refreshToken,
    type: "refresh",
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

const verifyToken = async (token, type) => {
  try {
    const secret =
      type === "access"
        ? process.env.ACCESS_TOKEN_SECRET
        : process.env.REFRESH_TOKEN_SECRET;

    const decoded = jwt.verify(token, secret);

    // Check if token is blacklisted
    const tokenDoc = await Token.findOne({
      token,
      type,
      blacklisted: false,
    });

    if (!tokenDoc) {
      throw new Error("Token invalidated");
    }

    return decoded;
  } catch (error) {
    throw new AppError("Invalid or expired token", 401);
  }
};

const invalidateToken = async (token, type) => {
  await Token.findOneAndUpdate(
    { token, type },
    { blacklisted: true },
    { new: true }
  );
};

const rotateRefreshToken = async (oldRefreshToken) => {
  // Verify old token
  const decoded = await verifyToken(oldRefreshToken, "refresh");

  // Invalidate old token
  await invalidateToken(oldRefreshToken, "refresh");

  // Generate new tokens
  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return await generateTokens(user._id, user.role);
};

module.exports = {
  generateTokens,
  verifyToken,
  invalidateToken,
  rotateRefreshToken,
};
