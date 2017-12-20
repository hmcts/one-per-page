const { notDefined, defined } = require('../util/checks');
const FieldError = require('./fieldError');
const { mapEntries } = require('../util/ops');

const failOnFirstFailure = (field, validations) => {
  if (!(validations && validations.length)) {
    return { result: true, errors: [] };
  }
  const [currentValidation, ...rest] = validations;
  const maybeError = currentValidation(field);

  if (notDefined(maybeError)) {
    return failOnFirstFailure(field, rest);
  }
  return { result: false, errors: [maybeError] };
};

const omitIfUndefined = field => {
  if (notDefined(field.value)) {
    return {};
  }
  return { [field.name]: field.value };
};

const errorsProp = Symbol('errors');
const validatedProp = Symbol('validated');
const validProp = Symbol('valid');

class FieldValue {
  constructor({
    id, name, value,
    validations = [],
    serializer = omitIfUndefined
  }) {
    this.id = defined(id) ? id : name;
    this.name = name;
    if (defined(value)) this.value = value;
    this.validations = validations;
    this.serializer = serializer;

    this[validatedProp] = false;
    this[errorsProp] = [];
  }

  static from(args, fieldDesc) {
    return new this(Object.assign({}, args, {
      validations: fieldDesc.validations,
      serializer: fieldDesc.serializer
    }));
  }

  serialize() {
    return this.serializer(this);
  }

  validate() {
    const { result, errors } = failOnFirstFailure(this, this.validations);
    this[errorsProp] = errors;
    this[validProp] = result;
    this[validatedProp] = true;

    return result;
  }

  get errors() {
    return this[errorsProp];
  }
  get valid() {
    return this[validProp];
  }
  get validated() {
    return this[validatedProp];
  }
  get mappedErrors() {
    return this.errors.map(error => new FieldError(this, error));
  }
}


class ObjectFieldValue extends FieldValue {
  constructor({ id, name, serializer, validations, fields = [] }) {
    super({ id, name, serializer, validations });

    this.fields = fields;
    Object.keys(fields).forEach(key => {
      this[key] = this.fields[key];
    });
  }

  get value() {
    return mapEntries(this.fields, (name, field) => field.value);
  }
}


class ListFieldValue extends ObjectFieldValue {
  get value() {
    return Object.values(this.fields).map(field => field.value);
  }
}

const fieldValue = args => new FieldValue(args);

module.exports = { FieldValue, fieldValue, ObjectFieldValue, ListFieldValue };
