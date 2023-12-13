const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);
const sendEmail = async (to, subject, text) => {
  const msg = {
    to,
    from: "Polito Thesis Management System <tgdaniad@gmail.com>",
    text,
    subject,
  };
  sgMail
    .send(msg)
    .then((r) => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = { sendEmail };
