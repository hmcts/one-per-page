const Joi = require('joi');
const option = require('option');
const { FieldDesriptor } = require('./field');
const { parseErrorTarget } = require('./validator');

class TargetNotFoundError extends Error {
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

const noChange = value => value;

class CompoundField extends FieldDesriptor {
  constructor(name, ...fields) {
    super(name);
    this.fields = fields;
    this.transformValue = noChange;

    fields.forEach(field => {
      this[field.name] = field;
    });
  }

  parse(key, body = {}) {
    this.fields.forEach(field => field.parse(field.name, body));

    return this;
  }

  deserialize(key, session = {}) {
    const values = option
      .fromNullable(session[this.name])
      .valueOrElse({});

    this.fields.forEach(field => field.deserialize(field.name, values));

    return this;
  }

  serialize() {
    return { [this.name]: this.fieldValues };
  }

  validate() {
    const results = this.fields.map(field => field.validate());
    if (results.some(result => result === false)) {
      this._validated = true;
      this._valid = false;
      return false;
    }
    return super.validate();
  }

  addValidation(id, message, validator) {
    if (id === this.name || id === 'no-target') {
      this.validations.push(validator);
    } else if (this.fields.some(f => f.name === id)) {
      this[id].validations.push(validator);
    } else {
      throw new TargetNotFoundError(id, this);
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
      super.mappedErrors,
      ...this.fields.map(field => field.mappedErrors)
    ].reduce((left, right) => [...left, ...right], []);
  }

  mapValue(func) {
    this.transformValue = func;
    return this;
  }
}

const compoundField = (name, ...fields) => new CompoundField(name, ...fields);

module.exports = { CompoundField, compoundField };
