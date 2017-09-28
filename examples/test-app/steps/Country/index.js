const { Question, form, field, goTo, branch } = require('@hmcts/one-per-page');
const Joi = require('joi');
const content = require('./content');

class Country extends Question {
  get url() {
    return '/country';
  }

  get i18NextContent() {
    return content;
  }

  get form() {
    const ukCountries = ['northern-ireland', 'scotland', 'england', 'wales'];

    return form(
      field('country')
        .joi(this.content.errors.required, Joi.string().valid(ukCountries))
    );
  }

  next() {
    const livesInNI = () =>
      this.fields.country.value === 'northern-ireland';

    return branch(
      goTo(this.journey.ExitNorthernIreland).if(livesInNI),
      goTo(this.journey.Name)
    );
  }
}

module.exports = Country;
