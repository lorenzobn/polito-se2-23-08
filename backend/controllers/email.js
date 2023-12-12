const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);
const msg = {
  to: "daniad7@outlook.com", // Change to your recipient
  from: "tgdaniad@gmail.com", // Change to your verified sender
  subject: "Sending with SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};
sgMail
  .send(msg)
  .then((r) => {
    console.log("Email sent");
  })
  .catch((error) => {
    console.error(error);
  });
