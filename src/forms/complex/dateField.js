const Joi = require('joi');
const { compoundField, errorFor } = require('../compoundField');
const { textField } = require('../simpleFields');

const dateField = (
  name,
  {
    allRequired = 'Enter a date',
    dayRequired = 'Enter a day',
    monthRequired = 'Enter a month',
    yearRequired = 'Enter a year'
  } = {}
) => {
  const dayField = textField('day');
  const monthField = textField('month');
  const yearField = textField('year');
  return compoundField(name, dayField, monthField, yearField)
    .joi(
      errorFor('day', dayRequired),
      Joi.object()
        .with('year', 'day')
        .with('month', 'day')
    )
    .joi(
      errorFor('month', monthRequired),
      Joi.object()
        .with('year', 'month')
        .with('day', 'month')
    )
    .joi(
      errorFor('year', yearRequired),
      Joi.object()
        .with('day', 'year')
        .with('month', 'year')
    )
    .joi(
      allRequired,
      Joi.object().keys({
        day: Joi.string().required(),
        month: Joi.string().required(),
        year: Joi.string().required()
      })
    );
};

module.exports = dateField;
