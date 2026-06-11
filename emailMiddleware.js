const LOGO_URL =
  "https://res.cloudinary.com/dfowjilak/image/upload/v1781104984/heavenhub-assets/email-logo.png";

module.exports.resetPassEmailOtp = (email, otp, name) => {
  return {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Reset Your Password — Heaven Hub",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f0f2f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header with gradient -->
          <tr>
            <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:32px 40px;text-align:center;">
              <img src="${LOGO_URL}" alt="Heaven Hub" width="140" style="display:block;margin:0 auto 12px;max-width:140px;height:auto;" />
              <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.85);letter-spacing:0.5px;">Your Home Away From Home</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <!-- Greeting -->
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:600;color:#1a1a2e;">Hello, ${name} 👋</h1>
              <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;">
                We received a request to reset your password. Use the verification code below to proceed. This code is valid for <strong>15 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:12px;padding:20px 48px;text-align:center;">
                          <span style="font-size:32px;font-weight:700;color:#ffffff;letter-spacing:8px;font-family:'Courier New',monospace;">${otp}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Security notice -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:28px;">
                <tr>
                  <td style="background-color:#fef3c7;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:14px 18px;">
                    <p style="margin:0;font-size:13px;color:#92400e;line-height:1.5;">
                      🔒 <strong>Security Tip:</strong> Never share this code with anyone. Heaven Hub will never ask for your OTP via phone or chat.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:14px;color:#9ca3af;line-height:1.6;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;color:#9ca3af;">© ${new Date().getFullYear()} Heaven Hub — All Rights Reserved</p>
              <p style="margin:0;font-size:12px;color:#d1d5db;">This is an automated email. Please do not reply.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };
};

module.exports.newUseremailOtp = (email, otp) => {
  return {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Verify Your Email — Heaven Hub",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f0f2f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header with gradient -->
          <tr>
            <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:32px 40px;text-align:center;">
              <img src="${LOGO_URL}" alt="Heaven Hub" width="140" style="display:block;margin:0 auto 12px;max-width:140px;height:auto;" />
              <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.85);letter-spacing:0.5px;">Your Home Away From Home</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <!-- Welcome badge -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <span style="display:inline-block;background:linear-gradient(135deg,#e0e7ff,#ede9fe);color:#4338ca;font-size:13px;font-weight:600;padding:6px 16px;border-radius:20px;letter-spacing:0.5px;">✨ WELCOME TO HEAVEN HUB</span>
                  </td>
                </tr>
              </table>

              <!-- Greeting -->
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:600;color:#1a1a2e;text-align:center;">Verify Your Email</h1>
              <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;text-align:center;">
                Thank you for signing up! Please use the verification code below to complete your registration.
              </p>

              <!-- OTP Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:12px;padding:20px 48px;text-align:center;">
                          <span style="font-size:32px;font-weight:700;color:#ffffff;letter-spacing:8px;font-family:'Courier New',monospace;">${otp}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Steps -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:32px;">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="width:36px;height:36px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;text-align:center;vertical-align:middle;color:#fff;font-size:14px;font-weight:700;">1</td>
                        <td style="padding-left:14px;font-size:14px;color:#4b5563;">Copy the verification code above</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="width:36px;height:36px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;text-align:center;vertical-align:middle;color:#fff;font-size:14px;font-weight:700;">2</td>
                        <td style="padding-left:14px;font-size:14px;color:#4b5563;">Paste it into the verification page</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="width:36px;height:36px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;text-align:center;vertical-align:middle;color:#fff;font-size:14px;font-weight:700;">3</td>
                        <td style="padding-left:14px;font-size:14px;color:#4b5563;">Start exploring amazing stays! 🏡</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:14px;color:#9ca3af;line-height:1.6;text-align:center;">
                If you didn't create an account, please ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;color:#9ca3af;">© ${new Date().getFullYear()} Heaven Hub — All Rights Reserved</p>
              <p style="margin:0;font-size:12px;color:#d1d5db;">This is an automated email. Please do not reply.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };
};
