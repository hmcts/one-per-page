const option = require('option');

class Form {
  constructor(fields = []) {
    this.fields = fields;
  }

  get(name) {
    return this.fields.find(field => field.name === name);
  }

  /**
   * Parses the fields described in the form from the request body
   * Used on POST requests.
   *
   * @param {object} req - the express request
   * @return {list} fields - the parsed fields containing their values
   */
  parse(req) {
    this.fields.forEach(field => field.parse(req));
    return this;
  }

  /**
   * Stores the fields described in the form to the session by querying their
   * parsed values in request.fields
   *
   * @param {object} req - the express request
   */
  store(req) {
    if (typeof req.session === 'undefined') {
      throw new Error('Session not initialized');
    }
    this.fields.forEach(field => {
      const serialized = field.serialize();
      Object.assign(req.session, serialized);
    });
  }

  /**
   * Loads the fields described in the form from the session.
   * Used on GET requests to prepopulate fields with existing values.
   *
   * @param {object} req - the express request
   * @return {list} fields - the populated fields containing their values
   */
  retrieve(req) {
    this.fields.forEach(field => field.deserialize(req));
    return this;
  }

  errors(/* parsedFields */) {
    // placeholder for now
    return [];
  }

  get invalidFields() {
    return this.fields.filter(field => !field.validate());
  }

  get valid() {
    const validLength = 0;
    return this.invalidFields.length === validLength;
  }
}

const form = (...fields) => new Form(fields);

const defaultValidator = () => null;

class FieldDesriptor {
  constructor(name, id, value) {
    this.name = name;
    this.id = id;
    this.value = value;
    this.validator = defaultValidator;
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
      this.validator = validator;
      return this;
    }
    this.error = this.validator(this);
    return !this.error;
  }
}

const field = name => new FieldDesriptor(name);

module.exports = { field, FieldDesriptor, form, Form };
