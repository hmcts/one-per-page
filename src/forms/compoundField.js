const Joi = require('joi');
const option = require('option');
const FieldError = require('./fieldError');

class BadValidationTargetError extends Error {
  constructor(id, field) {
    const targets = [field.name, ...field.fields.map(f => f.name)];
    const message = `${id} not recognised. Must be one of ${targets.join(',')}`;
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.targetId = id;
  }
}

const isNullOrUndefined = value =>
  typeof value === 'undefined' || value === null;

const failOnFirstFailure = validations => {
  if (!(validations && validations.length)) {
    return { result: true, errors: [] };
  }
  const [currentValidation, ...rest] = validations;
  const maybeError = currentValidation();

  if (!maybeError || isNullOrUndefined(maybeError)) {
    return failOnFirstFailure(rest);
  }
  return { result: false, errors: [maybeError] };
};

const errorFor = (id, message) => {
  return { id, message };
};

const parseErrorTarget = (targetOrMessage, fallbackId) => {
  const isObject = typeof targetOrMessage === 'object';
  if (isObject && 'message' in targetOrMessage && 'id' in targetOrMessage) {
    return targetOrMessage;
  }
  return errorFor(fallbackId, targetOrMessage);
};

const noChange = value => value;

class CompoundField {
  constructor(name, ...fields) {
    this.name = name;
    this.id = name;
    this.fields = fields;
    this.validations = [];
    this.errors = [];
    this.validated = false;

    this.transformValue = noChange;

    fields.forEach(field => {
      this[field.name] = field;
    });
  }

  parse(body = {}) {
    this.fields.forEach(field => field.parse(body));

    return this;
  }

  deserialize(session = {}) {
    const values = option
      .fromNullable(session[this.name])
      .valueOrElse({});

    this.fields.forEach(field => field.deserialize(values));

    return this;
  }

  serialize() {
    return { [this.name]: this.fieldValues };
  }

  validate() {
    const results = this.fields.map(field => field.validate());
    if (results.some(result => result === false)) {
      this.validated = true;
      this.valid = false;
      return false;
    }
    const { result, errors } = failOnFirstFailure(this.validations);
    this.errors = errors;
    this.valid = result;
    this.validated = true;
    return result;
  }

  addValidation(id, message, validator) {
    if (id === this.name) {
      this.validations.push(validator);
    } else if (this.fields.some(f => f.name === id)) {
      this[id].validations.push(validator);
    } else {
      throw new BadValidationTargetError(id, this);
    }
    return this;
  }

  joi(targetOrError, joiSchema) {
    const { message, id } = parseErrorTarget(targetOrError, this.name);
    const validator = () => {
      const { error } = Joi.validate(this.fieldValues, joiSchema);
      return error ? message : error;
    };
    return this.addValidation(id, message, validator);
  }

  check(targetOrError, predicate) {
    const { message, id } = parseErrorTarget(targetOrError, this.name);
    const validator = () => {
      if (predicate(this.fieldValues)) {
        return false;
      }
      return message;
    };
    return this.addValidation(id, message, validator);
  }

  get fieldValues() {
    return this.fields
      .map(field => field.serialize())
      .reduce((obj, value) => Object.assign(obj, value), {});
  }

  get value() {
    return this.transformValue(this.fieldValues);
  }

  get mappedErrors() {
    return [
      this.errors.map(error => new FieldError(this, error)),
      ...this.fields.map(field => field.mappedErrors)
    ].reduce((left, right) => [...left, ...right], []);
  }

  mapValue(func) {
    this.transformValue = func;
    return this;
  }
}

const compoundField = (name, ...fields) => new CompoundField(name, ...fields);

module.exports = { CompoundField, compoundField, errorFor };
