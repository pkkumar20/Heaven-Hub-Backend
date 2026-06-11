const { BrevoClient } = require("@getbrevo/brevo");

const client = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

/**
 * Send email using Brevo HTTP API.
 * Accepts the same mailOptions shape as nodemailer: { from, to, subject, html }
 * and a callback(error, info) for drop-in compatibility.
 */
function sendMail(mailOptions, callback) {
  client.transactionalEmails
    .sendTransacEmail({
      sender: { name: process.env.EMAIL_FROM_NAME || "Heaven Hub", email: mailOptions.from },
      to: [{ email: mailOptions.to }],
      subject: mailOptions.subject,
      htmlContent: mailOptions.html,
    })
    .then(
      (data) => {
        callback(null, data);
        console.log("Brevo email success:", data);
      },
      (error) => {
        console.error("Brevo email error:", error?.body || error);
        callback(error, null);
      }
    );
}

module.exports = { sendMail };
