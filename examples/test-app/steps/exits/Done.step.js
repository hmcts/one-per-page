const { ExitPoint } = require('@hmcts/one-per-page');

class Done extends ExitPoint {
  get url() {
    return '/done';
  }
}

module.exports = Done;
