const { Page } = require('@hmcts/one-per-page');

const thisIsAnExample = [
  'This is an error that has been thrown on purpose to illustrate what',
  'happens in the event of an exception'
].join('');

/** Class representing a what happens when an error is throw */
class ExampleServerError extends Page {
  static get path() {
    return '/example-server-error';
  }

  handler(/* req, res */) {
    throw new Error(thisIsAnExample);
  }
}

module.exports = ExampleServerError;
