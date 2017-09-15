const Joi = require('joi');
const { first } = require('lodash');

const defaultMin = 0;
const defaultMax = 30;
const isString = ({
  language = {},
  min = defaultMin,
  max = defaultMax,
  required = true
}) => {
  const validator = Joi.string().alphanum()
    .min(min)
    .max(max);
  if (required) {
    validator.required();
  }
  return field => {
    const error = Joi.validate(field.value, validator, language).error;
    if (error) {
      return first(error.details).message;
    }
    return error;
  };
};

const isOneOf = ({ language = {}, validValues = [], required = true }) => {
  const validator = Joi.string()
    .valid(validValues);
  if (required) {
    validator.required();
  }
  return field => {
    const error = Joi.validate(field.value, validator, language).error;
    if (error) {
      return first(error.details).message;
    }
    return error;
  };
};

module.exports = { isString, isOneOf };