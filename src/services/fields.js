const option = require('option');

class Form {
  constructor(fields = []) {
    this.fields = fields;
  }

  parse(req) {
    return this.fields.map(field => field.parse(req));
  }

  validate(/* parsedFields */) {
    /* intentionally blank */
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

class ParsedField {
  constructor(name, id, value) {
    this.name = name;
    this.id = id;
    this.value = value;
  }
}

class FieldDesriptor {
  constructor(name) {
    this.name = name;
  }

  parse(req) {
    const id = this.makeId(req.currentStep);

    const valueFromSession = option
      .fromNullable(req.session)
      .flatMap(session => option.fromNullable(session[id]));

    const valueFromBody = option
      .fromNullable(req.body)
      .flatMap(body => option.fromNullable(body[id]));

    const value = valueFromBody
      .orElse(valueFromSession)
      .valueOrElse('');

    return new ParsedField(this.name, id, value);
  }

  makeId(step) {
    if (typeof step === 'undefined' || typeof step.name === 'undefined') {
      return this.name;
    }
    return `${step.name}_${this.name}`;
  }
}

const field = (name, validator) => new FieldDesriptor(name, validator);

module.exports = { field, FieldDesriptor, ParsedField, form, Form };
