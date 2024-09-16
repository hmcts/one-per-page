const Joi = require('joi');
const { compoundField, errorFor } = require('../compoundField');
const { textField } = require('../simpleFields');
const moment = require('moment');

const isValidDate = date =>
  moment(`${date.year}-${date.month}-${date.day}`, 'YYYY-MM-DD').isValid();

const dateField = (
  name,
  {
    allRequired = 'Enter a valid date',
    dayRequired = 'Enter a valid day',
    monthRequired = 'Enter a valid month',
    yearRequired = 'Enter a valid year',
    invalidDate = 'Entered date is invalid'
  } = {}
) => {
  const dayField = textField('day');
  const monthField = textField('month');
  const yearField = textField('year');
  const dayLimit = 31;
  const monthLimit = 12;
  const yearLimit = 9999;
  return compoundField(name, dayField, monthField, yearField)
    .joi(
      errorFor('day', dayRequired),
      Joi.object({
        day: Joi.number().integer()
          .min(1)
          .max(dayLimit),
        month: Joi.any(),
        year: Joi.any()
      })
        .with('year', 'day')
        .with('month', 'day')
    )
    .joi(
      errorFor('month', monthRequired),
      Joi.object({
        day: Joi.any(),
        month: Joi.number().integer()
          .min(1)
          .max(monthLimit),
        year: Joi.any()
      })
        .with('year', 'month')
        .with('day', 'month')
    )
    .joi(
      errorFor('year', yearRequired),
      Joi.object({
        day: Joi.any(),
        month: Joi.any(),
        year: Joi.number().integer()
          .min(1)
          .max(yearLimit)
      })
        .with('day', 'year')
        .with('month', 'year')
    )
    .joi(
      allRequired,
      Joi.object({
        day: Joi.string().required(),
        month: Joi.string().required(),
        year: Joi.string().required()
      })
    )
    .check(
      invalidDate, isValidDate
    );
};

module.exports = dateField;
