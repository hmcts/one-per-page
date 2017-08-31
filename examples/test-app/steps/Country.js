const { Question, form, field, goTo, branch } = require('@hmcts/one-per-page');

class Country extends Question {
  get url() {
    return '/country';
  }

  get form() {
    return form(field('country'));
  }

  next() {
    const livesInNI = () => this.fields.country.value === 'northern-ireland';

    return branch(
      goTo(this.journey.ExitNorthernIreland).if(livesInNI),
      goTo(this.journey.Name)
    );
  }
}

module.exports = Country;
