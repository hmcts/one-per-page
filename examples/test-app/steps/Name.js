const { Question, field } = require('@hmcts/one-per-page');

class Name extends Question {
  get url() {
    return '/name';
  }

  get fields() {
    return [field('firstName'), field('lastName')];
  }
}

module.exports = Name;
