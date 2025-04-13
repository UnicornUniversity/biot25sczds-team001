const Joi = require("joi");

const validate = (schema) => {
    return (req, res, next) => {
        const {error} = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 400,
                message: "Invalid input data",
                details: error.details.map((detail) => detail.message),
            });
        }
        next();
    };
};

module.exports = validate;
