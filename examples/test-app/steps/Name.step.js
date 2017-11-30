const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');

class Name extends Question {
  get form() {
    return form(
      textField('firstName').joi(
        this.content.fields.firstName.required,
        Joi.string().required()
      ),
      textField('lastName').joi(
        this.content.fields.lastName.required,
        Joi.string().required()
      ),
      textField.ref(this.journey.steps.RespondentTitle, 'husbandOrWife'),
      textField('respondentFirstName').joi(
        this.content.fields.respondentFirstName.required,
        Joi.string().required()
      ),
      textField('respondentLastName').joi(
        this.content.fields.respondentLastName.required,
        Joi.string().required()
      )
    );
  }

  get husbandOrWife() {
    if (typeof this.fields.husbandOrWife.value !== 'undefined') {
      return this.fields.husbandOrWife.value;
    }
    return 'husband/wife';
  }

  next() {
    return goTo(this.journey.steps.Contact);
  }
}

module.exports = Name;
