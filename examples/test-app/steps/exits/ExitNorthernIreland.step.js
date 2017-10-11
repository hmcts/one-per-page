const { Page } = require('@hmcts/one-per-page');

class ExitNorthernIreland extends Page {
  get url() {
    return '/exit/northern-ireland';
  }
}

module.exports = ExitNorthernIreland;
