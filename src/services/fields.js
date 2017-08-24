const option = require('option');

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
      .map(session => session[id]);

    const valueFromBody = option
      .fromNullable(req.body)
      .map(body => body[id]);

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

const field = name => new FieldDesriptor(name);

module.exports = { field, FieldDesriptor, ParsedField };
