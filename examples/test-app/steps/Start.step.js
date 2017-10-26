const { Page } = require('@hmcts/one-per-page');

class Start extends Page {
  static get path() {
    return '/';
  }
}

module.exports = Start;
