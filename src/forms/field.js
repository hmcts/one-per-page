const option = require('option');
const Joi = require('joi');
const { nonEmptyTextParser } = require('./fieldParsers');
const FieldError = require('./fieldError');
const { notDefined } = require('../util/checks');

const isNullOrUndefined = value =>
  typeof value === 'undefined' || value === null;

const parseJoiArgs = (field, args) => {
  if (args.length === 1) {
    const [joiSchema] = args;
    return { message: `No error content for ${field.name}`, joiSchema };
  }
  const [message, joiSchema] = args;
  return { message, joiSchema };
};

const failOnFirstFailure = (field, validations) => {
  if (!(validations && validations.length)) {
    return { result: true, errors: [] };
  }
  const [currentValidation, ...rest] = validations;
  const maybeError = currentValidation(field);

  if (isNullOrUndefined(maybeError)) {
    return failOnFirstFailure(field, rest);
  }
  return { result: false, errors: [maybeError] };
};


class FieldDesriptor {
  constructor(name, fieldParser = nonEmptyTextParser) {
    this.parser = fieldParser;
    this.name = name;
    this.id = name;
    this.validations = [];
    this._validated = false;
    this._errors = [];
  }

  /**
   * Parses the request body looking for a parameter with the same name
   * as this field.
   *
   * @param {object} body - the request body
   * @return {FieldDescriptor} field - the parsed field filled with it's value
   */
  parse(key, body = {}) {
    this.value = option
      .fromNullable(body[this.name])
      .map(content => this.parser.parse(content))
      .valueOrElse(this.parser.nullValue);

    return this;
  }

  /**
   * Deserializes this field from the session
   *
   * @param {object} req - the express request
   * @return {FieldDescriptor} field - the loaded field filled with it's value
   */
  deserialize(key, values = {}) {
    this.value = option
      .fromNullable(values[this.name])
      .valueOrElse(this.parser.nullValue);

    return this;
  }

  /**
   * Serializes the field in to format to be stored in the session
   *
   * @return {{ [field id]: [field value] }} - the values to be store in the
   *   session
   */
  serialize() {
    if (notDefined(this.value)) {
      if (notDefined(this.parser.nullValue)) {
        return {};
      }
      return { [this.name]: this.parser.nullValue };
    }
    return { [this.name]: this.value };
  }

  get errors() {
    return this._errors;
  }

  get mappedErrors() {
    return this.errors.map(error => new FieldError(this, error));
  }

  get valid() {
    return this._valid;
  }

  get validated() {
    return this._validated;
  }

  validate(validator) {
    if (validator) {
      this.validations.push(validator);
      return this;
    }

    const { result, errors } = failOnFirstFailure(this, this.validations);
    this._errors = errors;
    this._valid = result;
    this._validated = true;
    return result;
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

const field = (name, parser) => new FieldDesriptor(name, parser);

module.exports = { field, FieldDesriptor };
