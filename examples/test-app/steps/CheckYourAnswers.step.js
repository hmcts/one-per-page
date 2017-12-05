const {
  CheckYourAnswers: CYA,
  section
} = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo, action } = require('@hmcts/one-per-page/flow');
const request = require('request-promise-native');

class CheckYourAnswers extends CYA {
  constructor(...args) {
    super(...args);
    this.sendToAPI = this.sendToAPI.bind(this);
  }

  sections() {
    return [
      section('personal-details', { title: 'Personal Details' }),
      section('respondent-details', { title: 'Respondent Details' })
    ];
  }

  sendToAPI() {
    const apiUrl = this.journey.settings.apiUrl;
    const json = this.journey.values;
    return request.post(apiUrl, { json });
  }

  next() {
    return action(this.sendToAPI)
      .then(goTo(this.journey.steps.Done))
      .onFailure(goTo(this.journey.steps.Error));
  }
}

module.exports = CheckYourAnswers;
