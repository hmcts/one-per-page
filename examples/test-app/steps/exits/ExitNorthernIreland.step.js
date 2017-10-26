const { Page } = require('@hmcts/one-per-page');

class ExitNorthernIreland extends Page {
  static get path() {
    return '/exit/northern-ireland';
  }
}

module.exports = ExitNorthernIreland;
