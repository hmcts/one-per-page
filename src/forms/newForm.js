const { notDefined } = require('../util/checks');
const {
  mapEntries,
  andWise, orWise,
  flattenArray, flattenObject
} = require('../util/ops');
const option = require('option');

class FilledForm {
  constructor(fieldValues) {
    this.fields = fieldValues;
  }

  store(stepName, req) {
    if (notDefined(req.session)) {
      throw new Error('Session not initialized');
    }
    const values = Object.values(this.fields)
      .map(field => field.serialize())
      .reduce(flattenObject, {});

    if (values !== {}) {
      Object.assign(req.session, { [stepName]: values });
    }
  }

  validate() {
    return Object.values(this.fields)
      .map(field => field.validate())
      .reduce(andWise, true);
  }

  get validated() {
    return Object.values(this.fields)
      .map(field => field.validated)
      .reduce(orWise, false);
  }

  get errors() {
    return Object.values(this.fields)
      .map(field => field.mappedErrors)
      .reduce(flattenArray, []);
  }

  get valid() {
    return !Object.values(this.fields)
      .some(field => !field.valid);
  }
}

class Form {
  constructor(fields = {}) {
    this.fields = fields;
  }

  parse(req) {
    const body = req.body || {};
    const fieldValues = mapEntries(
      this.fields,
      (key, field) => field.parse(key, body)
    );
    return new FilledForm(fieldValues);
  }

  retrieve(stepName, req) {
    if (notDefined(req.session)) {
      throw new Error('Session not initialized');
    }
    const values = option.fromNullable(req.session[stepName]).valueOrElse({});
    const fieldValues = mapEntries(
      this.fields,
      (key, field) => field.deserialize(key, values)
    );
    return new FilledForm(fieldValues);
  }
}

const form = args => new Form(args);

module.exports = { form, Form, FilledForm };
