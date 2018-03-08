const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');

class InfoPage extends Interstitial {
  next() {
    return goTo(this.journey.steps.Country);
  }
}

module.exports = InfoPage;
