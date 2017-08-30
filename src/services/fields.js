const option = require('option');

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
    return this.fields.map(field => field.parse(req));
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
      if (typeof req.fields[field.name] === 'undefined') {
        const fields = JSON.stringify({ 'req.fields': req.fields });
        throw new Error(`Field ${field.name} not present in ${fields}`);
      }
      const serialized = req.fields[field.name].serialize();
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
    return this.fields.map(field => field.deserialize(req));
  }

  errors(/* parsedFields */) {
    // placeholder for now
    return [];
  }

  valid(/* parsedFields */) {
    // placeholder for now
    return true;
  }
}

const form = (...fields) => new Form(fields);

class FieldDesriptor {
  constructor(name, id, value) {
    this.name = name;
    this.id = id;
    this.value = value;
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
      .flatMap(body => option.fromNullable(body[this.name]))
      .valueOrElse('');

    return new FieldDesriptor(this.name, id, value);
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

    return new FieldDesriptor(this.name, id, value);
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
}

const field = name => new FieldDesriptor(name);

module.exports = { field, FieldDesriptor, form, Form };
