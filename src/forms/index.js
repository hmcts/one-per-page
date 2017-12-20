const { form } = require('./newForm');
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
  object,
  ref,
  convert
} = require('./fields');

const { errorFor } = require('./validator');

const dateField = require('./complex/dateField');

module.exports = {
  form,
  nonEmptyText,
  text,
  bool,
  list,
  object,
  ref,
  convert,
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
