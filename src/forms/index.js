const { form } = require('./newForm');
const { field } = require('./field');
const { compoundField, errorFor } = require('./compoundField');

const {
  arrayField,
  textField,
  nonEmptyTextField,
  boolField
} = require('./simpleFields');

const dateField = require('./complex/dateField');

module.exports = {
  form,
  field,
  arrayField,
  textField,
  nonEmptyTextField,
  boolField,
  compoundField,
  errorFor,
  dateField
};
