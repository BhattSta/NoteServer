const { createResponseData } = require("../utils/response");
const { userService } = require("../services");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const httpStatus = require("http-status");
const constant = require("../utils/constants");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");
const { catchAsync } = require("../utils/catchAsync");
// const { generateString } = require("../utils/randomGenerator");

const register = catchAsync(async (req, res) => {
  let { firstName, lastName, email, password } = req.body;

  const existingUser = await userService.getUserByEmail({ email });
  if (existingUser) {
    return createResponseData(
      res,
      {},
      httpStatus.CONFLICT,
      true,
      constant.EMAIL_EXISTS
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  password = hashedPassword;

  const user = {
    firstName,
    lastName,
    email,
    password,
  };

  const emailVerificationToken = jwt.sign(
    {
      userEmail: user.email,
    },
    process.env.EMAIL_VERIFICATION_TOKEN,
    { expiresIn: "50m" }
  );

  // const emailVerificationToken = generateString(50);

  await userService.createUser(user);

  const encodedToken = encodeURI(emailVerificationToken).replace(/\./g, "%2E");
  await sendVerificationEmail(user.email, encodedToken);

  // await sendVerificationEmail(user.email, emailVerificationToken);

  return createResponseData(
    res,
    { emailVerificationToken },
    httpStatus.CREATED,
    false,
    constant.SUCCESS_REGISTRATION
  );
});

const verifyMail = catchAsync(async (req, res) => {
  const token = req.params.token;

  const decodedToken = jwt.verify(token, process.env.EMAIL_VERIFICATION_TOKEN);
  const userEmail = decodedToken.userEmail;

  if (decodedToken.exp < Date.now() / 1000) {
    return createResponseData(
      res,
      {},
      httpStatus.BAD_REQUEST,
      true,
      constant.TOKEN_EXPIRED
    );
  }

  const updatedUser = await userService.emailVerification(userEmail, {
    isEmailVerified: true,
  });
  if (!updatedUser) {
    return createResponseData(
      res,
      {},
      httpStatus.NOT_FOUND,
      true,
      constant.USER_NOT_FOUND
    );
  }
  return createResponseData(
    res,
    {},
    httpStatus.OK,
    false,
    constant.EMAIL_VERIFIED
  );
});

const resendVerificationMail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const existingUser = await userService.getUserByEmail({ email });
  if (!existingUser) {
    return createResponseData(
      res,
      {},
      httpStatus.NOT_FOUND,
      true,
      constant.USER_NOT_FOUND
    );
  }

  const emailVerificationToken = jwt.sign(
    {
      userEmail: existingUser.email,
    },
    process.env.EMAIL_VERIFICATION_TOKEN,
    { expiresIn: "50m" }
  );

  const encodedToken = encodeURI(emailVerificationToken).replace(/\./g, "%2E");
  await sendVerificationEmail(existingUser.email, encodedToken);

  // await sendVerificationEmail(existingUser.email, emailVerificationToken);

  return createResponseData(
    res,
    {},
    httpStatus.OK,
    false,
    constant.EMAIL_SENT_FOR_VERIFICATION
  );
});

const login = catchAsync(async (req, res) => {
  let { email, password } = req.body;
  const user = await userService.getUserByEmail({ email });
  if (!user) {
    return createResponseData(
      res,
      {},
      httpStatus.UNAUTHORIZED,
      true,
      constant.EMAIL_NOT_REGISTERED
    );
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return createResponseData(
      res,
      {},
      httpStatus.UNAUTHORIZED,
      true,
      constant.INVALID_PASSWORD
    );
  }
  if (user.isEmailVerified === true) {
    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "5h" }
    );

    const data = {
      userId: user._id,
      userFirstName: user.firstName,
      userLastName: user.lastName,
      userEmail: user.email,
      token: token,
    };

    return createResponseData(res, data, httpStatus.OK, false, {});
  } else {
    return createResponseData(
      res,
      {},
      httpStatus.UNAUTHORIZED,
      true,
      constant.EMAIL_EXISTS_BUT_NOT_VERIFIED
    );
  }
});

module.exports = {
  register,
  verifyMail,
  resendVerificationMail,
  login,
};
