const option = require('option');
const { FieldValue } = require('./fieldValue');
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
    serializer
  } = {}) {
    this.parser = parser;
    this.deserializer = deserializer;
    this.serializer = serializer;
    this.validations = [];
  }

  ensureField(name, value) {
    if (value instanceof FieldValue) return value;
    return FieldValue.from({ name, value }, this);
  }

  parse(name, body = {}) {
    return this.ensureField(name, this.parser(name, body));
  }

  deserialize(name, values = {}) {
    return this.ensureField(name, this.deserializer(name, values));
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
