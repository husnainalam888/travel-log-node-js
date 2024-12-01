const Joi = require("joi");

const validateSignUp = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  next();
};
const validateSignIn = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  next();
};

const validateStartJourney = (req, res, next) => {
  const schema = Joi.object({
    lat: Joi.number().required().min(-90).max(90).messages({
      "any.required": "Latitude is required",
      "number.base": "Latitude must be a number",
      "number.min": "Latitude must be between -90 and 90",
      "number.max": "Latitude must be between -90 and 90",
    }),
    lng: Joi.number().required().min(-180).max(180).messages({
      "any.required": "Longitude is required",
      "number.base": "Longitude must be a number",
      "number.min": "Longitude must be between -180 and 180",
      "number.max": "Longitude must be between -180 and 180",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Validation for end journey
const validateEndJourney = (req, res, next) => {
  const schema = Joi.object({
    lat: Joi.number().required().min(-90).max(90).messages({
      "any.required": "Latitude is required",
      "number.base": "Latitude must be a number",
      "number.min": "Latitude must be between -90 and 90",
      "number.max": "Latitude must be between -90 and 90",
    }),
    lng: Joi.number().required().min(-180).max(180).messages({
      "any.required": "Longitude is required",
      "number.base": "Longitude must be a number",
      "number.min": "Longitude must be between -180 and 180",
      "number.max": "Longitude must be between -180 and 180",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateSignUp,
  validateSignIn,
  validateStartJourney,
  validateEndJourney,
};
