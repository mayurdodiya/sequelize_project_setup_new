const Joi = require("joi");

// Add College
const addCollege = {
  body: Joi.object().keys({
    name: Joi.string().trim().required().messages({
      "string.empty": "College name is required!",
      "any.required": "College name is required!",
    }),
  }),
};

// Update College (like bodyValidation + optional fields)
const updateCollege = {
  body: Joi.object()
    .keys({
      name: Joi.string().trim().optional(),
    })
    .min(1)
    .messages({
      "object.min": "Request body cannot be empty!",
    }),
};

module.exports = {
  addCollege,
  updateCollege,
};
