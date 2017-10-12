const { Question, form, checkboxField, goTo } = require('@hmcts/one-per-page');
const Joi = require('joi');

class Contact extends Question {
  get url() {
    return '/contact';
  }

  get form() {
    const validAnswers = Joi.string().valid(['phone', 'email', 'post']);

    return form(
      checkboxField('contactMethod').joi(
        this.content.errors.noOptionSelected,
        Joi.array()
          .items(validAnswers)
          .min(1)
      )
    );
  }

  next() {
    return goTo(this.journey.Sessions);
  }
}

module.exports = Contact;
