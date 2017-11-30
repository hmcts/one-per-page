const { Question, goTo, branch } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');

class Country extends Question {
  get form() {
    const ukCountries = ['northern-ireland', 'scotland', 'england', 'wales'];
    const validCountry = Joi.string()
      .valid(ukCountries)
      .required();

    return form(
      textField('country').joi(this.content.errors.required, validCountry)
    );
  }

  next() {
    const livesInNI = () =>
      this.fields.country.value === 'northern-ireland';

    return branch(
      goTo(this.journey.steps.ExitNorthernIreland).if(livesInNI),
      goTo(this.journey.steps.RespondentTitle)
    );
  }
}

module.exports = Country;
