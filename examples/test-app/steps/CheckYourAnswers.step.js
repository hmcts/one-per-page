const {
  CheckYourAnswers: CYA,
  section
} = require('@hmcts/one-per-page/checkYourAnswers');

class CheckYourAnswers extends CYA {
  sections() {
    return [
      section('personal-details', { title: 'Personal Details' }),
      section('respondent-details', { title: 'Respondent Details' })
    ];
  }
}

module.exports = CheckYourAnswers;
