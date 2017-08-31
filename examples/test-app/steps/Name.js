const { Question, field, form, goTo } = require('@hmcts/one-per-page');
const { isString } = require('../utils/validators');

class Name extends Question {
  get url() {
    return '/name';
  }

  get form() {
    return form(
      field('firstName').validate(isString()),
      field('lastName').validate(isString())
    );
  }

  next() {
    return goTo(this.journey.Sessions);
  }
}

module.exports = Name;
