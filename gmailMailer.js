const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground" // Redirect URI used during token generation
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: "v1", auth: oauth2Client });

/**
 * Build an RFC 2822 compliant email string from mailOptions.
 * @param {object} mailOptions - { from, to, subject, html }
 * @returns {string} Base64url-encoded raw email
 */
function buildRawEmail(mailOptions) {
  const boundary = "boundary_" + Date.now().toString(16);

  // RFC 2047 encode the subject to handle non-ASCII chars (em dashes, etc.)
  const encodedSubject = `=?UTF-8?B?${Buffer.from(mailOptions.subject, "utf-8").toString("base64")}?=`;

  const headers = [
    `From: ${process.env.EMAIL_FROM_NAME || "Heaven Hub"} <${mailOptions.from}>`,
    `To: ${mailOptions.to}`,
    `Subject: ${encodedSubject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ].join("\r\n");

  const body = [
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    mailOptions.html,
    `--${boundary}--`,
  ].join("\r\n");

  const email = `${headers}\r\n\r\n${body}`;

  // Encode to base64url (RFC 4648 §5)
  return Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Send email using Gmail API.
 * Accepts the same mailOptions shape as nodemailer/brevoMailer:
 *   { from, to, subject, html }
 * and a callback(error, info) for drop-in compatibility.
 *
 * @param {object} mailOptions - Email options
 * @param {function} callback  - callback(error, info)
 */
function sendMail(mailOptions, callback) {
  const raw = buildRawEmail(mailOptions);

  gmail.users.messages
    .send({
      userId: "me",
      requestBody: { raw },
    })
    .then(
      (response) => {
        console.log("Gmail email sent successfully:", response.data.id);
        callback(null, response.data);
      },
      (error) => {
        console.error(
          "Gmail email error:",
          error?.response?.data || error.message || error
        );
        callback(error, null);
      }
    );
}

module.exports = { sendMail };
