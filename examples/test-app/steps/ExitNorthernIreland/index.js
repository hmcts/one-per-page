const { Page } = require('@hmcts/one-per-page');
const content = require('./content');

class ExitNorthernIreland extends Page {
  get url() {
    return '/exit/northern-ireland';
  }

  get _content() {
    return content;
  }
}

module.exports = ExitNorthernIreland;
