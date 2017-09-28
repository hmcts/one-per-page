const { Question, field, form, goTo } = require('@hmcts/one-per-page');
const Joi = require('joi');
const content = require('./content');

class Name extends Question {
  get url() {
    return '/name';
  }

  get i18NextContent() {
    return content;
  }

  get form() {
    return form(
      field('firstName')
        .joi(this.content.fields.firstName.required, Joi.string().required()),
      field('lastName')
        .joi(this.content.fields.lastName.required, Joi.string().required())
    );
  }

  next() {
    return goTo(this.journey.Sessions);
  }
}

module.exports = Name;
