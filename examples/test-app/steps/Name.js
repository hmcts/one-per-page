const { Question, field, form, goTo } = require('@hmcts/one-per-page');

class Name extends Question {
  get url() {
    return '/name';
  }

  get form() {
    return form(
      field('firstName'),
      field('lastName')
    );
  }

  next() {
    return goTo(this.journey.Sessions);
  }
}

module.exports = Name;
