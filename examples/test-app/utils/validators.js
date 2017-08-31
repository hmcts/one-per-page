const Joi = require('joi');

const defaultMin = 0;
const defaultMax = 30;
const isString = (min = defaultMin, max = defaultMax, required = true) => {
  const validator = Joi.string().alphanum()
    .min(min)
    .max(max);
  if (required) {
    validator.required();
  }
  return field => Joi.validate(field.value, validator).error;
};

module.exports = { isString };