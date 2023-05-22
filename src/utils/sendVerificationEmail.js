const { userService, emailService } = require("../services");
const { transporter } = require("../config/email.config");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

const sendVerificationEmail = async (userEmail, emailVerificationToken) => {
  const encodedToken = encodeURI(emailVerificationToken).replace(/\./g, "%2E");
  const url = `http://localhost:5173/verifyEmail/${encodedToken}`;
  const filePath = path.join(
    __dirname,
    "../public/templates/emailVerification.html"
  );

  const existingUser = await userService.getUserByEmail({ userEmail });

  const source = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(source);
  const replacements = {
    username: existingUser.firstName,
    url: url,
  };
  const htmlToSend = template(replacements);

  const result = await transporter.sendMail(
    {
      from: process.env.EMAIL_USERNAME,
      to: userEmail,
      subject: "verify Account",
      html: htmlToSend,
    },
    (error, result) => {
      if (error) {
        console.log(error);
      }
    }
  );
  return result;
};

module.exports = {
  sendVerificationEmail,
};
