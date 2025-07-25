const {
  generateVerificationCode,
  createVerificationRecord,
} = require("../utils/verificationCodes");
const { sendEmail } = require("../config/email");
const verificationCodes = require("../utils/verificationCodes");

const sendVerificationEmail = async (email) => {
  const code = await createVerificationRecord(email, "email_verification");

  const subject = "Verify Your Email - KIT Japanese Club";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">KIT Japanese Club - Email Verification</h2>
      <p>Thank you for registering with KIT Japanese Club!</p>
      <p>Please use the following verification code to complete your registration:</p>
      <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; font-size: 24px; 
          font-weight: bold; text-align: center; margin: 20px 0; color: #2c3e50;">
        ${code}
      </div>
      <p>This code will expire in 5 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #7f8c8d;">KIT Japanese Club Team</p>
    </div>
  `;

  await sendEmail(email, subject, html);
};

const sendPasswordResetEmail = async (email) => {
  const code = await verificationCodes.createVerificationRecord(
    email,
    "password_reset"
  );

  const subject = "Password Reset Request - KIT Japanese Club";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Password Reset Request</h2>
      <p>We received a request to reset your password for your KIT Japanese Club account.</p>
      <p>Please use the following code to reset your password:</p>
      <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; font-size: 24px; 
          font-weight: bold; text-align: center; margin: 20px 0; color: #2c3e50;">
        ${code}
      </div>
      <p>This code will expire in 5 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #7f8c8d;">KIT Japanese Club Team</p>
    </div>
  `;

  await sendEmail(email, subject, html);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
