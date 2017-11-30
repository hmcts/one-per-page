const { Action } = require('@hmcts/one-per-page/steps');
const { goTo, branch } = require('@hmcts/one-per-page/flow');
const request = require('request-promise-native');

class SendToAPI extends Action {
  action() {
    const json = { foo: 'foo' };
    return request.post(this.journey.settings.apiUrl, { json });
  }

  next() {
    return branch(
      goTo(this.journey.steps.Error).if(this.failed),
      goTo(this.journey.steps.Done)
    );
  }
}

module.exports = SendToAPI;
