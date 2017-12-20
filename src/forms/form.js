const { notDefined } = require('../util/checks');
const { mapEntries, flattenObject } = require('../util/ops');
const { FieldDesriptor } = require('./field');
const { filledForm } = require('./filledForm');
const option = require('option');
const logging = require('@log4js-node/log4js-api');

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
    return filledForm(fieldValues);
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
    return filledForm(fieldValues);
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

module.exports = { form, Form };
