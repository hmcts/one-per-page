const FieldError = require('../../src/forms/fieldError');
const { notDefined } = require('../util/checks');
const defaultIfUndefined = require('../util/defaultIfUndefined');

class Form {
  constructor(fields = []) {
    this.fields = fields;
  }

  bind(step) {
    this.stepName = step.name;
    return this;
  }

  /**
   * Parses the fields described in the form from the request body
   * Used on POST requests.
   *
   * @param {object} req - the express request
   * @return {list} fields - the parsed fields containing their values
   */
  parse(req) {
    this.fields.forEach(field => field.parse(req.body || {}, req));
    return this;
  }

  /**
   * Stores the fields described in the form to the session by querying their
   * parsed values in request.fields
   *
   * @param {object} req - the express request
   */
  store(req) {
    if (notDefined(req.session)) {
      throw new Error('Session not initialized');
    }
    if (notDefined(this.stepName)) {
      throw new Error('Form is not bound to a step');
    }
    const values = this.fields
      .map(field => field.serialize())
      .reduce((kv, obj) => Object.assign(obj, kv), {});

    if (values !== {}) {
      Object.assign(req.session, { [this.stepName]: values });
    }
  }

  /**
   * Loads the fields described in the form from the session.
   * Used on GET requests to prepopulate fields with existing values.
   *
   * @param {object} req - the express request
   * @return {list} fields - the populated fields containing their values
   */
  retrieve(req) {
    if (notDefined(req.session)) {
      throw new Error('Session not initialized');
    }
    if (notDefined(this.stepName)) {
      throw new Error('Form is not bound to a step');
    }
    const values = defaultIfUndefined(req.session[this.stepName], {});
    this.fields.forEach(field => field.deserialize(values, req));
    return this;
  }

  get valid() {
    const aFieldIsInvalid = this.fields.some(field => !field.valid);
    return !aFieldIsInvalid;
  }

  validate() {
    return this.fields
      .map(field => field.validate())
      .reduce((result, fieldResult) => result && fieldResult, true);
  }

  get validated() {
    const fieldsValidated = this.fields
      .map(field => field.validated)
      .reduce((result, fieldResult) => result || fieldResult, false);

    return fieldsValidated;
  }

  get errors() {
    const fieldErrors = this.fields
      .map(field => {
        const errors = field.errors.map(error => new FieldError(field, error));
        return errors;
      })
      .reduce((accum, errorsArr) => [...accum, ...errorsArr], []);
    return fieldErrors;
  }
}

const form = (...fields) => new Form(fields);

module.exports = { form, Form, FieldError };
