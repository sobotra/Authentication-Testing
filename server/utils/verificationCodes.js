const Verification = require("../models/Verification");

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const createVerificationRecord = async (email, type) => {
  // Clean up any existing records first
  await Verification.deleteMany({ email, type });

  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const record = await Verification.create({
    email,
    code,
    type,
    expiresAt,
  });

  console.log(`Created verification record for ${email}:`, record);
  return code;
};

const verifyCode = async (email, code, type) => {
  console.log(`Verifying code for ${email}, code: ${code}, type: ${type}`);

  const record = await Verification.findOne({
    email,
    code,
    type,
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    console.log("Verification failed - no matching record found");
    const expiredRecord = await Verification.findOne({ email, code, type });
    if (expiredRecord) {
      console.log("Found expired record:", expiredRecord);
    }
    throw new Error("Invalid or expired verification code");
  }

  console.log("Verification successful:", record);
  await Verification.findByIdAndUpdate(record._id, {
    $inc: { attempts: 1 },
  });

  return true;
};

const cleanupExpiredVerifications = async () => {
  const result = await Verification.deleteMany({
    expiresAt: { $lt: new Date() },
  });
  console.log(`Cleaned up ${result.deletedCount} expired verification records`);
};

module.exports = {
  generateVerificationCode,
  createVerificationRecord,
  verifyCode,
  cleanupExpiredVerifications,
};
