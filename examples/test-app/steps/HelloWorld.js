const { Page } = require('@hmcts/one-per-page');

class HelloWorld extends Page {
  get url() {
    return '/hello-world';
  }
}

module.exports = HelloWorld;
