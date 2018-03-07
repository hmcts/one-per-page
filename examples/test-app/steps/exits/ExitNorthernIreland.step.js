const { ExitPoint } = require('@hmcts/one-per-page');

class ExitNorthernIreland extends ExitPoint {
  static get path() {
    return '/exit/northern-ireland';
  }
}

module.exports = ExitNorthernIreland;
