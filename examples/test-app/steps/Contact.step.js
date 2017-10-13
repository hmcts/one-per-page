const { Question, goTo } = require('@hmcts/one-per-page');
const { form, boolField, arrayField } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');

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

  answers() {
    const contactMe = this.fields.contactMe.value;
    if (!contactMe) {
      return answer(this, {
        question: this.content.cya.question,
        answer: this.content.cya.dontContactMe,
        value: { contactMe: false }
      });
    }
    return answer(this, {
      question: this.content.cya.question,
      answer: this.content.cya.answer
    });
  }
}

module.exports = Contact;
