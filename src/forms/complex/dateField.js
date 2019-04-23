const Joi = require('joi');
const { compoundField, errorFor } = require('../compoundField');
const { textField } = require('../simpleFields');

const dateField = (
  name,
  {
    allRequired = 'Enter a valid date',
    dayRequired = 'Enter a valid day',
    monthRequired = 'Enter a valid month',
    yearRequired = 'Enter a valid year'
  } = {}
) => {
  const dayField = textField('day');
  const monthField = textField('month');
  const yearField = textField('year');
  return compoundField(name, dayField, monthField, yearField)
    .joi(
      allRequired,
      Joi.object().keys({
        day: Joi.string().required(),
        month: Joi.string().required(),
        year: Joi.string().required()
      })
    )
    .joi(
      errorFor('day', dayRequired),
      Joi.object({
        day: Joi.number().integer()
          .min(1)
          .max(31)
          .required(),
        month: Joi.any(),
        year: Joi.any()
      })
    )
    .joi(
      errorFor('month', monthRequired),
      Joi.object({
        day: Joi.any(),
        month: Joi.number().integer()
          .min(1)
          .max(12)
          .required(),
        year: Joi.any()
      })
    )
    .joi(
      errorFor('year', yearRequired),
      Joi.object({
        day: Joi.any(),
        month: Joi.any(),
        year: Joi.number().integer()
          .min(1)
          .max(9999)
          .required()
      })
    );
};

module.exports = dateField;
