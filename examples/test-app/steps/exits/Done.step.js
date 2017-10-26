const { ExitPoint } = require('@hmcts/one-per-page');

class Done extends ExitPoint {
  static get path() {
    return '/done';
  }
}

module.exports = Done;
