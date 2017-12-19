const { notDefined } = require('../util/checks');
const {
  mapEntries,
  andWise, orWise,
  flattenArray, flattenObject
} = require('../util/ops');
const { FieldDesriptor } = require('./field');
const option = require('option');
const logging = require('@log4js-node/log4js-api');

const fieldsProp = Symbol('fields');

class FilledForm {
  constructor(fieldValues = {}) {
    this[fieldsProp] = fieldValues;

    Object.entries(this.fields).forEach(([key, field]) => {
      this[key] = field;
    });
  }

  get fields() {
    return this[fieldsProp];
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
      (key, field) => field.parse(key, body, req)
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
      (key, field) => field.deserialize(key, values, req)
    );
    return new FilledForm(fieldValues);
  }
}

const form = (...args) => {
  if (args.some(arg => arg instanceof FieldDesriptor)) {
    logging
      .getLogger('forms.form')
      .warn("Deprecated: form(textField('foo')) syntax will be removed soon");
    const fields = args
      .map(field => {
        return { [field.name]: field };
      })
      .reduce(flattenObject, {});

    return new Form(fields);
  }
  return new Form(...args);
};

module.exports = { form, Form, FilledForm };
