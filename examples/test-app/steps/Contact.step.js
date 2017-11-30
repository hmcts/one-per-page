const { Question, goTo } = require('@hmcts/one-per-page');
const { form, boolField, arrayField } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');

const twoMethods = 2;

class Contact extends Question {
  get form() {
    const validAnswers = Joi.string().valid(['phone', 'email', 'post']);

    return form(
      boolField('contactMe'),
      arrayField('contactMethod').joi(
        this.content.errors.noOptionSelected,
        Joi.array()
          .items(validAnswers)
          .min(twoMethods)
      )
    );
  }

  next() {
    return goTo(this.journey.steps.CheckYourAnswers);
  }

  get contactMethods() {
    const [firstMethod, ...methods] = this.fields.contactMethod.value;

    return [
      firstMethod,
      methods.join(', ')
    ].join(' and ');
  }
}

module.exports = Contact;
