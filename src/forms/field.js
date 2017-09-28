const option = require('option');

const defaultValidator = () => null;
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

class FieldDesriptor {
  constructor(name, id, value) {
    this.name = name;
    this.id = id;
    this.value = value;
    this.validator = defaultValidator;
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
    const id = this.makeId(req.currentStep);

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
    const id = this.makeId(req.currentStep);

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

  makeId(step) {
    if (typeof step === 'undefined' || typeof step.name === 'undefined') {
      return this.name;
    }
    return `${step.name}_${this.name}`;
  }

  validate(validator) {
    if (validator) {
      this.validations.push(validator);
      return this;
    }

    const { result, errors } = failOnFirstFailure(this, this.validations);
    this.errors = errors;
    return result;
  }

  // one time setter, used once to set the content of the field
  content(content) {
    this.content = content;
    return this;
  }
}

const field = name => new FieldDesriptor(name);

module.exports = { field, FieldDesriptor };
