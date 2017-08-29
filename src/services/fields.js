const option = require('option');

class Form {
  constructor(fields = []) {
    this.fields = fields;
  }

  parse(req) {
    return this.fields.map(field => field.parse(req));
  }

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

  parse(req) {
    const id = this.makeId(req.currentStep);

    const value = option
      .fromNullable(req.body)
      .flatMap(body => option.fromNullable(body[this.name]))
      .valueOrElse('');

    return new FieldDesriptor(this.name, id, value);
  }

  deserialize(req) {
    const id = this.makeId(req.currentStep);

    const value = option
      .fromNullable(req.session)
      .flatMap(session => option.fromNullable(session[id]))
      .valueOrElse('');

    return new FieldDesriptor(this.name, id, value);
  }

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
