const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');

class RespondentName extends Question {
  get url() {
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
        'Enter your {{ husbandOrWifes }} first name',
        Joi.string().required()
      ),
      textField('lastName').joi(
        'Enter your {{ husbandOrWifes }} last name',
        Joi.string().required()
      )
    );
  }

  next() {
    return goTo(this.journey.Name);
  }
}

module.exports = RespondentName;
