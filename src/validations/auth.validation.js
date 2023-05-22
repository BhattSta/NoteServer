const Joi = require("joi");
const validateRequest = require("../utils/requestValidation");

async function registerValidation(req, res, next) {
  const register = {
    firstName: Joi.string()
      .min(3)
      .max(40)
      .required()
      .trim()
      .pattern(
        /^([A-Za-z]+\s)*[A-Za-z]+$/,
        `validation as digits and consecutive spaces not allowed in`
      ),

    lastName: Joi.string()
      .min(3)
      .max(40)
      .required()
      .trim()
      .pattern(
        /^([A-Za-z]+\s)*[A-Za-z]+$/,
        `validation as digits and consecutive spaces not allowed in`
      ),

    email: Joi.string().trim().email().required().lowercase(),

    isEmailVerified: Joi.boolean().default(false),

    password: Joi.string()
      .required()
      .trim()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{4,}$/,
        "validation as password must contain atleast 1 uppercase, 1 lowecase, 1 digit & 1 special character in"
      ),

    confirmPassword: Joi.string().custom((value, helper) => {
      if (value !== req.body.password) {
        // return helper.message("Password And Confirm Password Are Not Same");
        throw new Error("Password And Confirm Password Are Not Same");
      }
    }),
  };

  validateRequest(req, res, next, Joi.object(register));
}

async function LoginValidation(req, res, next) {
  const Login = {
    email: Joi.string().trim().email().required().lowercase(),

    password: Joi.string().trim().required(),
  };
  validateRequest(req, res, next, Joi.object(Login));
}

module.exports = {
  registerValidation,
  LoginValidation,
};
