const parsers = require('./fieldParsers');
const { field } = require('./field');
const { ref } = require('./ref');

const arrayField = name => field(name, parsers.arrayParser);
arrayField.ref = (step, name) => ref(step, name, parsers.arrayParser);

const textField = name => field(name, parsers.textParser);
textField.ref = (step, name) => ref(step, name, parsers.textParser);

const nonEmptyTextField = name => field(name, parsers.nonEmptyTextParser);
nonEmptyTextField.ref = (step, name) =>
  ref(step, name, parsers.nonEmptyTextParser);

const boolField = name => field(name, parsers.boolParser);
boolField.ref = (step, name) => ref(step, name, parsers.boolParser);

module.exports = {
  arrayField,
  textField,
  nonEmptyTextField,
  boolField
};
