const sgMail = require("@sendgrid/mail");

let p1 = "SG.JrlDFyelREKQGDRyNUr_M";
let p2 = "A.OcvM0vlXrjZq0JgQxy9FH7HtEvMDUbZZ9M6-jyWpD9A";
// sendgrid removes api key from their system if it is public on github
sgMail.setApiKey(p1 + p2);
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
