const Joi = require("joi");

// add user
const login = {
  body: Joi.object().keys({
    email: Joi.string().email().trim().required().messages({
      "string.email": "Invalid email format!",
      "string.empty": "Email is required!",
      "any.required": "Email is required!",
    }),

    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters!",
      "string.empty": "Password is required!",
      "any.required": "Password is required!",
    })
  }),
};

// add user
const register = {
  body: Joi.object().keys({
    name: Joi.string().trim().required().messages({
      "string.empty": "Name is required!",
      "any.required": "Name is required!",
    }),

    email: Joi.string().email().trim().required().messages({
      "string.email": "Invalid email format!",
      "string.empty": "Email is required!",
      "any.required": "Email is required!",
    }),

    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters!",
      "string.empty": "Password is required!",
      "any.required": "Password is required!",
    }),

    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.pattern.base": "Phone must be 10 digits!",
        "string.empty": "Phone is required!",
        "any.required": "Phone is required!",
      }),

    role: Joi.string().valid("user", "admin").optional().messages({
      "any.only": "Role must be either 'user' or 'admin'",
    }),

    details: Joi.object({
      address: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      pincode: Joi.string().optional(),
      gender: Joi.string().valid("male", "female").optional(),
    }).optional(),
  }),
};

const updateUser = {
  body: Joi.object()
    .keys({
      name: Joi.string().trim().optional(),

      phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .optional()
        .messages({
          "string.pattern.base": "Phone must be 10 digits!",
        }),

      details: Joi.object({
        address: Joi.string().optional(),
        city: Joi.string().optional(),
        state: Joi.string().optional(),
        country: Joi.string().optional(),
        pincode: Joi.string().optional(),
        gender: Joi.string().valid("male", "female").optional(),
      }).optional(),
    })
    .min(1)
    .messages({
      "object.min": "Request body cannot be empty!",
    }),
};

const userIdParam = {
  params: Joi.object().keys({
    id: Joi.number().integer().required().messages({
      "number.base": "User ID must be a number!",
      "any.required": "User ID is required!",
    }),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).optional(),
    size: Joi.number().integer().min(1).optional(),
    s: Joi.string().trim().optional(),
  }),
};

const viewAllUsers = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).optional().messages({
      "number.base": "Page must be a number!",
      "number.min": "Page must be at least 1!",
    }),

    size: Joi.number().integer().min(1).optional().messages({
      "number.base": "Size must be a number!",
      "number.min": "Size must be at least 1!",
      "number.max": "Size cannot exceed 100!",
    }),

    s: Joi.string().trim().optional().messages({
      "string.base": "Search must be a string!",
    }),
  }),
};

module.exports = {
  register,
  updateUser,
  userIdParam,
  getUsers,
  viewAllUsers,
  login,
};
