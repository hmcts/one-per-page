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

module.exports = { form, Form };
