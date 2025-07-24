const verificationCodes = new Map();

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const storeVerificationCode = (email, code) => {
  const expiry = Date.now() + 60000; // 1 minute expiry
  verificationCodes.set(email, { code, expiry });
};

const getVerificationCode = (email) => {
  return verificationCodes.get(email);
};

const deleteVerificationCode = (email) => {
  verificationCodes.delete(email);
};

const cleanExpiredCodes = () => {
  const now = Date.now();
  for (const [email, { expiry }] of verificationCodes.entries()) {
    if (now > expiry) {
      verificationCodes.delete(email);
    }
  }
};

// Clean expired codes every 5 minutes
setInterval(cleanExpiredCodes, 300000);

module.exports = {
  generateVerificationCode,
  storeVerificationCode,
  getVerificationCode,
  deleteVerificationCode,
};
