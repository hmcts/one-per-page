const { Page, middleware } = require('@hmcts/one-per-page');

class HelloWorld extends Page {
  get middleware() {
    return [middleware.requireSession, ...super.middleware];
  }
  get url() {
    return '/hello-world';
  }
}

module.exports = HelloWorld;
