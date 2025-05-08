const Joi = require("joi");

/**
 * Middleware to validate req.body against a Joi schema and strip unknown keys
 * @param {Joi.Schema} schema - Joi validation schema
 */
const validate = (schema) => {
  return (req, res, next) => {
    // validate and strip any keys not defined in the schema
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        status: 400,
        message: "Invalid input data",
        details: error.details.map((detail) => detail.message),
      });
    }

    // replace the original body with the filtered, validated value
    req.body = value;
    next();
  };
};

module.exports = validate;
