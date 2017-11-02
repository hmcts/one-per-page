const CYA = require('../../../src/steps/check-your-answers/CheckYourAnswers');
const { section } = require('../../../src/steps/check-your-answers/section');

class CheckYourAnswers extends CYA {
  sections() {
    return [
      section('personal-details', { title: 'Personal Details' }),
      section('respondent-details', { title: 'Respondent Details' })
    ];
  }
}

module.exports = CheckYourAnswers;
