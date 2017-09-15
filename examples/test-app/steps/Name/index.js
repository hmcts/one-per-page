const { Question, field, form, goTo } = require('@hmcts/one-per-page');
const { isString } = require('../../utils/validators');
const content = require('./content');

class Name extends Question {
  get url() {
    return '/name';
  }

  get i18NextContent() {
    return content;
  }

  get form() {
    return form(
      field('firstName')
        .validate(isString({ language: this.content.fields.firstName.joi }))
        .content(this.content.fields.firstName),
      field('lastName')
        .validate(isString({ language: this.content.fields.lastName.joi }))
        .content(this.content.fields.lastName)
    );
  }

  next() {
    return goTo(this.journey.Sessions);
  }
}

module.exports = Name;
