const { form } = require('./form');
const { field } = require('./field');
const { compoundField } = require('./compoundField');

const {
  arrayField,
  textField,
  nonEmptyTextField,
  boolField
} = require('./simpleFields');

const {
  nonEmptyText,
  text,
  bool,
  list,
  appendToList,
  object,
  ref,
  convert,
  date
} = require('./fields');

const { errorFor } = require('./validator');

const dateField = require('./complex/dateField');

module.exports = {
  form,
  nonEmptyText,
  text,
  bool,
  list,
  appendToList,
  object,
  ref,
  convert,
  date,
  errorFor,

  // old interfaces, soon to be removed
  field,
  arrayField,
  textField,
  nonEmptyTextField,
  boolField,
  compoundField,
  dateField
};
