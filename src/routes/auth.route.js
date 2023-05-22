const express = require("express");
const router = express.Router();
const { authController } = require("../controller");
const { authValidation } = require("../validations");

router.post(
  "/register",
  authValidation.registerValidation,
  authController.register
);

router.get("/verifyEmail/:token", authController.verifyMail);

router.post("/resendVerificationMail", authController.resendVerificationMail);

router.post("/login", authValidation.LoginValidation, authController.login);

module.exports = router;
