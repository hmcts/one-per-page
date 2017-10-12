const { Question, field, form, goTo } = require('@hmcts/one-per-page');
const Joi = require('joi');

class Name extends Question {
  get url() {
    return '/name';
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
    return goTo(this.journey.Contact);
  }
}

module.exports = Name;
