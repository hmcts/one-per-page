const { form } = require('./newForm');
const { field } = require('./field');
const { compoundField, errorFor } = require('./compoundField');

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
  object,
  ref
} = require('./fields');

const dateField = require('./complex/dateField');

module.exports = {
  form,
  nonEmptyText,
  text,
  bool,
  list,
  object,
  ref,
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
