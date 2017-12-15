const { notDefined } = require('../util/checks');

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
    this.id = id;
    this.name = name;
    this.value = value;
    this.validations = validations;
    this.serializer = serializer;
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
}

const fieldValue = args => new FieldValue(args);

module.exports = { FieldValue, fieldValue };
