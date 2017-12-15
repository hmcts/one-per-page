const option = require('option');
const { fieldValue } = require('./fieldValue');
const Joi = require('joi');


const getValue = (name, body) => option
  .fromNullable(body[name])
  .valueOrElse(undefined); // eslint-disable-line no-undefined


const parseJoiArgs = (field, args) => {
  if (args.length === 1) {
    const [joiSchema] = args;
    return { message: `No error content for ${field.name}`, joiSchema };
  }
  const [message, joiSchema] = args;
  return { message, joiSchema };
};


class FieldDescriptor {
  constructor({
    parser = getValue,
    deserializer = getValue,
    serializer,
    produces = fieldValue
  } = {}) {
    this.parser = parser;
    this.deserializer = deserializer;
    this.serializer = serializer;
    this.validations = [];
    this.field = produces;
  }

  fillField(name, value) {
    return this.field({
      id: name,
      name,
      value,
      validations: this.validations,
      serializer: this.serializer
    });
  }

  parse(name, body = {}) {
    return this.fillField(name, this.parser(name, body));
  }

  deserialize(name, values = {}) {
    return this.fillField(name, this.deserializer(name, values));
  }

  joi(...args) {
    this.validations.push(field => {
      const { message, joiSchema } = parseJoiArgs(field, args);
      const { error } = Joi.validate(field.value, joiSchema);
      return error ? message : error;
    });
    return this;
  }
}

const fieldDescriptor = (...args) => new FieldDescriptor(...args);

module.exports = { FieldDescriptor, fieldDescriptor };
