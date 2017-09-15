const { Page } = require('@hmcts/one-per-page');
const content = require('./content');

class HelloWorld extends Page {
  get url() {
    return '/hello-world';
  }

  get i18NextContent() {
    return content;
  }
}

module.exports = HelloWorld;
