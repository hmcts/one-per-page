const { notDefined, defined } = require('../util/checks');
const FieldError = require('./fieldError');
const { mapEntries, andWise } = require('../util/ops');
const { validator } = require('./validator');

const failOnFirstFailure = (field, validators) => {
  if (!(validators && validators.length)) {
    return { result: true, errors: [] };
  }
  const [currentValidator, ...rest] = validators;
  if (currentValidator.predicate(field)) {
    return failOnFirstFailure(field, rest);
  }
  return { result: false, errors: [currentValidator.message] };
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
  constructor({ id, name, serializer, validations = [], fields = [] }) {
    const myValidations = validations.filter(v => v.target === name);
    super({ id, name, serializer, validations: myValidations });

    this.fields = fields;
    Object.keys(fields).forEach(key => {
      const fieldsValidations = validations
        .filter(v => v.target === key)
        .map(v => validator(v.target, v.message, () => v.predicate(this)));
      this[key] = this.fields[key];
      this[key].validations.push(...fieldsValidations);
    });
  }

  get value() {
    return mapEntries(this.fields, (name, field) => field.value);
  }

  validate() {
    const childrenAreValid = Object.values(this.fields)
      .map(field => field.validate())
      .reduce(andWise, true);

    if (childrenAreValid) {
      return super.validate();
    }
    this._validated = true;
    this._valid = false;
    return false;
  }

  get mappedErrors() {
    return [
      super.mappedErrors,
      ...Object.values(this.fields).map(field => field.mappedErrors)
    ].reduce((left, right) => [...left, ...right], []);
  }
}


class ListFieldValue extends ObjectFieldValue {
  get value() {
    return Object.values(this.fields).map(field => field.value);
  }
}

class TransformFieldValue extends FieldValue {
  constructor({ transformation, field, validations = [] }) {
    super({ name: field.name, id: field.id, serializer: field.serializer });
    this.field = field;
    this.transformation = transformation;
    this.validations = validations;

    if (defined(this.field.fields)) {
      Object.entries(this.field.fields)
        .forEach(([key, childField]) => {
          this[key] = childField;
        });
    }
  }

  static from(args, descriptor) {
    return new this(
      Object.assign({}, args, { validations: descriptor.validations })
    );
  }

  serialize() {
    return this.field.serialize();
  }

  validate() {
    if (this.field.validate()) {
      return super.validate();
    }
    this[validProp] = false;
    return false;
  }

  get value() {
    return this.transformation(this.field.value);
  }

  get errors() {
    return [...this.field.errors, ...super.errors];
  }
  get valid() {
    return super.valid && this.field.valid;
  }
  get validated() {
    return this[validatedProp] && this.field.validated;
  }
}

const fieldValue = args => new FieldValue(args);

module.exports = {
  FieldValue, fieldValue,
  ObjectFieldValue,
  ListFieldValue,
  TransformFieldValue
};
