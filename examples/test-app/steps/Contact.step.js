const { Question, goTo } = require('@hmcts/one-per-page');
const { form, arrayField } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');

class Contact extends Question {
  get form() {
    const validAnswers = Joi.string().valid(['phone', 'email', 'post']);

    return form(
      arrayField('contactMethod').joi(
        this.content.errors.noOptionSelected,
        Joi.array()
          .items(validAnswers)
          .min(1)
      )
    );
  }

  next() {
    return goTo(this.journey.steps.CheckYourAnswers);
  }
}

module.exports = Contact;
