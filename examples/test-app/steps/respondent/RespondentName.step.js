const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');

class RespondentName extends Question {
  static get path() {
    return '/respondent-name';
  }

  get husbandOrWife() {
    if (typeof this.fields.husbandOrWife.value !== 'undefined') {
      return this.fields.husbandOrWife.value;
    }
    return 'husband/wife';
  }

  get form() {
    return form(
      textField.ref(this.journey.RespondentTitle, 'husbandOrWife'),
      textField('firstName').joi(
        this.content.error.firstName,
        Joi.string().required()
      ),
      textField('lastName').joi(
        this.content.error.lastName,
        Joi.string().required()
      )
    );
  }

  next() {
    return goTo(this.journey.Name);
  }
}

module.exports = RespondentName;
