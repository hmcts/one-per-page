const FieldError = require('../../src/forms/fieldError');

class Form {
  constructor(fields = []) {
    this.fields = fields;
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
