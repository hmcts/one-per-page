const { Question, form, field, goTo, branch } = require('@hmcts/one-per-page');
const { isOneOf } = require('../../utils/validators');
const content = require('./content');

class Country extends Question {
  get url() {
    return '/country';
  }

  get i18NextContent() {
    return content;
  }

  get form() {
    const validAnswers = ['northern-ireland', 'scotland', 'england', 'wales'];

    return form(
      field('country')
        .validate(isOneOf({
          validValues: validAnswers,
          language: this.content.fields.country.joi
        }))
        .content(this.content.fields.country)
    );
  }

  next() {
    const livesInNI = () =>
      this.fields.get('country').value === 'northern-ireland';

    return branch(
      goTo(this.journey.ExitNorthernIreland).if(livesInNI),
      goTo(this.journey.Name)
    );
  }
}

module.exports = Country;

