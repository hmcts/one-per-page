const option = require('option');
const Joi = require('joi');

const isNullOrUndefined = value =>
  typeof value === 'undefined' || value === null;

const parseJoiArgs = (field, args) => {
  if (args.length === 1) { // eslint-disable-line no-magic-numbers
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


const makeId = (field, step) => {
  if (typeof step === 'undefined' || typeof step.name === 'undefined') {
    return field.name;
  }
  return `${step.name}_${field.name}`;
};


class FieldDesriptor {
  constructor(name, id, value) {
    this.name = name;
    this.id = id;
    this.value = value;
    this.validations = [];
  }

  /**
   * Parses the request body looking for a parameter with the same name
   * as this field.
   *
   * @param {object} req - the express request
   * @return {FieldDescriptor} field - the parsed field filled with it's value
   */
  parse(req) {
    const id = makeId(this, req.currentStep);

    const value = option
      .fromNullable(req.body)
      .flatMap(body => option.fromNullable(body[id]))
      .valueOrElse('');

    this.id = id;
    this.value = value;
    return this;
  }

  /**
   * Deserializes this field from the session
   *
   * @param {object} req - the express request
   * @return {FieldDescriptor} field - the loaded field filled with it's value
   */
  deserialize(req) {
    const id = makeId(this, req.currentStep);

    const value = option
      .fromNullable(req.session)
      .flatMap(session => option.fromNullable(session[id]))
      .valueOrElse('');

    this.id = id;
    this.value = value;
    return this;
  }

  /**
   * Serializes the field in to format to be stored in the session
   *
   * @return {{ [field id]: [field value] }} - the values to be store in the
   *   session
   */
  serialize() {
    if (typeof this.id === 'undefined') return {};
    if (typeof this.value === 'undefined') return {};
    return { [this.id]: this.value };
  }

  get errors() {
    if (typeof this._errors === 'undefined') {
      this.validate();
    }
    return this._errors;
  }

  get valid() {
    if (typeof this._valid === 'undefined') {
      return this.validate();
    }
    return this._valid;
  }

  validate(validator) {
    if (validator) {
      this.validations.push(validator);
      return this;
    }

    const { result, errors } = failOnFirstFailure(this, this.validations);
    this._errors = errors;
    this._valid = result;
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

const field = name => new FieldDesriptor(name);

module.exports = { field, FieldDesriptor };
