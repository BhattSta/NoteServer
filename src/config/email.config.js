const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter
  .verify()
  .then(() => console.log("Connected to email server"))
  .catch(() =>
    console.log(
      "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
    )
  );

module.exports = {
  transporter,
};
