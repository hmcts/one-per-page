const {
  CheckYourAnswers: CYA,
  section
} = require('@hmcts/one-per-page/checkYourAnswers');
const { goTo } = require('@hmcts/one-per-page/flow');

class CheckYourAnswers extends CYA {
  sections() {
    return [
      section('personal-details', { title: 'Personal Details' }),
      section('respondent-details', { title: 'Respondent Details' })
    ];
  }

  next() {
    return goTo(this.journey.steps.SendToAPI);
  }
}

module.exports = CheckYourAnswers;
