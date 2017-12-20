const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');

class RespondentTitle extends Question {
  static get path() {
    return '/who-are-you-divorcing';
  }

  get form() {
    return form({
      husbandOrWife: text.joi(
        'Select who you are divorcing',
        Joi.string().required()
          .valid(['wife', 'husband'])
      )
    });
  }

  answers() {
    return answer(this, { hide: true });
  }

  next() {
    return goTo(this.journey.steps.Name);
  }
}

module.exports = RespondentTitle;
