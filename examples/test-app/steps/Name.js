const { Question, field, form } = require('@hmcts/one-per-page');

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
}

module.exports = Name;
