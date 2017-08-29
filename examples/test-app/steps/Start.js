const { Page } = require('@hmcts/one-per-page');

class Start extends Page {
  get url() {
    return '/';
  }
}

module.exports = Start;
