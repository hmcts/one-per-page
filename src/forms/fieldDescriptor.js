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
    serializer,
    validations = []
  } = {}) {
    this.parser = parser;
    this.deserializer = deserializer;
    this.serializer = serializer;
    this.validations = validations;
  }

  clone(overrides) {
    return new this.constructor(
      Object.assign({
        parser: this.parser,
        deserializer: this.deserializer,
        serializer: this.serializer,
        validations: this.validations
      }, overrides)
    );
  }

  ensureField(name, value) {
    if (value instanceof FieldValue) return value;
    return FieldValue.from({ name, value }, this);
  }

  parse(name, body = {}, req = {}) {
    return this.ensureField(name, this.parser(name, body, req));
  }

  deserialize(name, values = {}, req = {}) {
    return this.ensureField(name, this.deserializer(name, values, req));
  }

  joi(...args) {
    const joi = field => {
      const { message, joiSchema } = parseJoiArgs(field, args);
      const { error } = Joi.validate(field.value, joiSchema);
      return error ? message : error;
    };
    return this.clone({ validations: [...this.validations, joi] });
  }

  check(message, predicate) {
    const check = field => {
      if (predicate(field.value)) {
        return undefined; // eslint-disable-line no-undefined
      }
      return message;
    };
    return this.clone({ validations: [...this.validations, check] });
  }
}

const fieldDescriptor = (...args) => new FieldDescriptor(...args);

module.exports = { FieldDescriptor, fieldDescriptor };
