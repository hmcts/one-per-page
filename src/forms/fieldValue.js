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

  clone(overrides) {
    return new this.constructor(Object.assign({}, this, overrides));
  }
}


class ObjectFieldValue extends FieldValue {
  constructor({ id, name, serializer, validations = [], fields = [] }) {
    const myValidations = validations.filter(v => v.target === 'no-target');
    super({ id, name, serializer, validations: myValidations });

    this.fields = mapEntries(fields, (key, field) => {
      const fieldsValidations = validations
        .filter(v => v.target === key)
        .map(v => validator(v.target, v.message, () => v.predicate(this)));
      const mappedValidations = [...fieldsValidations, ...field.validations];

      return field.clone({ validations: mappedValidations });
    });

    Object.keys(this.fields)
      .forEach(key => {
        this[key] = this.fields[key];
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
  constructor({ transformation, wrapped, validations = [] }) {
    super({
      name: wrapped.name,
      id: wrapped.id,
      serializer: wrapped.serializer
    });
    this.wrapped = wrapped;
    this.transformation = transformation;
    this.validations = validations;

    if (defined(this.wrapped.fields)) {
      Object.entries(this.wrapped.fields)
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
    return this.wrapped.serialize();
  }

  validate() {
    if (this.wrapped.validate()) {
      return super.validate();
    }
    this[validProp] = false;
    return false;
  }

  get value() {
    return this.transformation(this.wrapped.value);
  }

  get errors() {
    return [...this.wrapped.errors, ...super.errors];
  }
  get valid() {
    return super.valid && this.wrapped.valid;
  }
  get validated() {
    return this[validatedProp] && this.wrapped.validated;
  }
}

const fieldValue = args => new FieldValue(args);

module.exports = {
  FieldValue, fieldValue,
  ObjectFieldValue,
  ListFieldValue,
  TransformFieldValue
};
