const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');

class Name extends Question {
  get url() {
    return '/name';
  }

  get form() {
    return form(
      textField('firstName')
        .joi(this.content.fields.firstName.required, Joi.string().required()),
      textField('lastName')
        .joi(this.content.fields.lastName.required, Joi.string().required())
    );
  }

  next() {
    return goTo(this.journey.Contact);
  }
}

module.exports = Name;
