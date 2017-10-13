const { form } = require('./form');
const { field } = require('./field');
const parsers = require('./fieldParsers');

const arrayField = name => field(name, parsers.arrayParser);
const textField = name => field(name, parsers.textParser);
const nonEmptyTextField = name => field(name, parsers.nonEmptyTextParser);

module.exports = { form, field, arrayField, textField, nonEmptyTextField };
