const {
  generateVerificationCode,
  createVerificationRecord,
} = require("../utils/verificationCodes");
const { sendEmail } = require("../config/email");

const sendVerificationEmail = async (email) => {
  const code = await createVerificationRecord(email, "email_verification");

  const subject = "Verify Your Email - KIT Japanese Club";
  const html = `
    <div style="
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    ">
      <div style="text-align: center; margin-bottom: 2rem;">
        <img src="https://example.com/logo.png" alt="KIT Japanese Club" style="height: 60px; margin-bottom: 1rem;">
        <h2 style="
          color: #3a0ca3;
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        ">
          Email Verification
        </h2>
        <p style="color: #6c757d; margin-bottom: 0;">Welcome to KIT Japanese Club!</p>
      </div>

      <div style="
        background: #f8f9fa;
        padding: 2rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        text-align: center;
      ">
        <p style="margin-bottom: 1rem; color: #495057;">Your verification code is:</p>
        <div style="
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: 0.2rem;
          color: #3a0ca3;
          margin: 1rem 0;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          display: inline-block;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        ">
          ${code}
        </div>
        <p style="color: #6c757d; font-size: 0.875rem;">
          This code expires in 5 minutes
        </p>
      </div>

      <div style="margin-bottom: 2rem;">
        <p style="color: #495057; margin-bottom: 1.5rem;">
          Thank you for registering with KIT Japanese Club! Please enter this verification code 
          in the app or website to complete your registration.
        </p>
        <p style="color: #6c757d; font-size: 0.875rem;">
          If you didn't request this email, you can safely ignore it.
        </p>
      </div>

      <div style="
        padding-top: 1.5rem;
        border-top: 1px solid #e9ecef;
        text-align: center;
        color: #6c757d;
        font-size: 0.75rem;
      ">
        <p>© ${new Date().getFullYear()} KIT Japanese Club. All rights reserved.</p>
        <p style="margin-top: 0.5rem;">
          <a href="https://example.com" style="color: #4361ee; text-decoration: none;">Our Website</a> • 
          <a href="https://example.com/contact" style="color: #4361ee; text-decoration: none;">Contact Us</a>
        </p>
      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};

const sendPasswordResetEmail = async (email) => {
  const code = await createVerificationRecord(email, "password_reset");

  const subject = "Password Reset - KIT Japanese Club";
  const html = `
    <div style="
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    ">
      <div style="text-align: center; margin-bottom: 2rem;">
        <img src="https://example.com/logo.png" alt="KIT Japanese Club" style="height: 60px; margin-bottom: 1rem;">
        <h2 style="
          color: #d90429;
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #ef233c 0%, #d90429 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        ">
          Password Reset
        </h2>
        <p style="color: #6c757d; margin-bottom: 0;">Secure your account</p>
      </div>

      <div style="
        background: #fff0f0;
        padding: 2rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        text-align: center;
        border-left: 4px solid #ef233c;
      ">
        <p style="margin-bottom: 1rem; color: #495057;">Your password reset code is:</p>
        <div style="
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: 0.2rem;
          color: #d90429;
          margin: 1rem 0;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          display: inline-block;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        ">
          ${code}
        </div>
        <p style="color: #6c757d; font-size: 0.875rem;">
          This code expires in 5 minutes
        </p>
      </div>

      <div style="margin-bottom: 2rem;">
        <p style="color: #495057; margin-bottom: 1.5rem;">
          We received a request to reset your password. Enter this code in the app or website 
          to create a new secure password.
        </p>
        <p style="color: #6c757d; font-size: 0.875rem; font-weight: 600;">
          If you didn't request this password reset, please secure your account immediately.
        </p>
      </div>

      <div style="
        padding-top: 1.5rem;
        border-top: 1px solid #e9ecef;
        text-align: center;
        color: #6c757d;
        font-size: 0.75rem;
      ">
        <p>© ${new Date().getFullYear()} KIT Japanese Club. All rights reserved.</p>
        <p style="margin-top: 0.5rem;">
          <a href="https://example.com" style="color: #4361ee; text-decoration: none;">Our Website</a> • 
          <a href="https://example.com/security" style="color: #4361ee; text-decoration: none;">Security Tips</a>
        </p>
      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
