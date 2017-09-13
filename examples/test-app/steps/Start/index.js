const { Page } = require('@hmcts/one-per-page');
const content = require('./content');

class Start extends Page {
  get url() {
    return '/';
  }

  get i18NextContent() {
    return content;
  }
}

module.exports = Start;
