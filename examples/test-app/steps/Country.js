const { Question, form, field, goTo, branch } = require('@hmcts/one-per-page');
const { isOneOf } = require('../utils/validators');

class Country extends Question {
  get url() {
    return '/country';
  }

  get form() {
    const validAnswers = ['northern-ireland', 'scotland', 'england', 'wales'];
    return form(field('country').validate(isOneOf(validAnswers)));
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
