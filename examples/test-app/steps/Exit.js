const { goTo, ExitPoint } = require('@hmcts/one-per-page');

class Exit extends ExitPoint {
  get url() {
    return '/exit';
  }
}

module.exports = Exit;