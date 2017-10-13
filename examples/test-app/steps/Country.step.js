const { Question, goTo, branch } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');


const titleise = string => {
  if (typeof string === 'undefined') {
    return '';
  }
  if (string.length < 1) {
    return string.toUpperCase();
  }
  const firstChar = string[0].toUpperCase();
  const rest = string.slice(1)
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase();

  return `${firstChar}${rest}`;
};


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

  answers() {
    return answer(this, {
      section: 'personal-details',
      answer: titleise(this.fields.country.value)
    });
  }
}

module.exports = Country;
