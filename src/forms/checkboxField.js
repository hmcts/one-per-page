const { FieldDesriptor } = require('./field');
const { arrayField } = require('./fieldType');

class CheckboxFieldDescriptor extends FieldDesriptor {
  constructor(...args) {
    super(...args);
    this.type = arrayField;
  }
}

const checkboxField = name => new CheckboxFieldDescriptor(name);

module.exports = { checkboxField, CheckboxFieldDescriptor };
