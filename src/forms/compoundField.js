const Joi = require('joi');
const option = require('option');

const isNullOrUndefined = value =>
  typeof value === 'undefined' || value === null;

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

class CompoundField {
  constructor(name, ...fields) {
    this.name = name;
    this.id = name;
    this.fields = fields;
    this.validations = [];
    this.errors = [];
    this._validated = false;

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
    return { [this.name]: this.value };
  }

  validate() {
    const results = this.fields.map(field => field.validate());
    if (results.some(result => result === false)) {
      this._validated = true;
      this._valid = false;
      return false;
    }
    const { result, errors } = failOnFirstFailure(this, this.validations);
    this.errors = errors;
    this._valid = result;
    this._validated = true;
    return result;
  }

  joi(message, joiSchema) {
    this.validations.push(field => {
      const { error } = Joi.validate(field.value, joiSchema);
      return error ? message : error;
    });
    return this;
  }

  get value() {
    return this.fields
      .map(field => field.serialize())
      .reduce((obj, value) => Object.assign(obj, value), {});
  }
}

module.exports = CompoundField;
