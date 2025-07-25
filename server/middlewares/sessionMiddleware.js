const Token = require("../models/Token");

const sessionValidator = async (req, res, next) => {
  if (!req.user) return next();

  try {
    // Check if session is still valid
    const activeSession = await Token.findOne({
      userId: req.user.userId,
      type: "refresh",
      blacklisted: false,
      expiresAt: { $gt: new Date() },
    });

    if (!activeSession) {
      return res.status(401).json({
        status: "fail",
        message: "Session expired. Please log in again.",
      });
    }

    // Attach session info to request
    req.session = {
      id: activeSession._id,
      issuedAt: activeSession.createdAt,
      expiresAt: activeSession.expiresAt,
    };

    next();
  } catch (error) {
    next(error);
  }
};

const concurrentSessionHandler = async (req, res, next) => {
  if (!req.user) return next();

  try {
    // Limit to 3 concurrent sessions per user
    const activeSessions = await Token.find({
      userId: req.user.userId,
      type: "refresh",
      blacklisted: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (activeSessions.length > 3) {
      // Invalidate oldest sessions beyond limit
      const sessionsToInvalidate = activeSessions.slice(3);
      await Token.updateMany(
        { _id: { $in: sessionsToInvalidate.map((s) => s._id) } },
        { blacklisted: true }
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sessionValidator,
  concurrentSessionHandler,
};
