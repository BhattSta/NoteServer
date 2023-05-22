const Joi = require("joi");
const validateRequest = require("../utils/requestValidation");

async function taskValidation(req, res, next) {
  const tasks = {
    title: Joi.string().min(3).max(40).required().trim(),
    description: Joi.string().min(3).max(140).required().trim(),
    status: Joi.string()
      .required()
      .trim()
      .valid("active", "completed", "deleted")
      .default("active"),
    date: Joi.date(),
  };

  validateRequest(req, res, next, Joi.object(tasks));
}

module.exports = {
  taskValidation,
};
