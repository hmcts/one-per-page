const { ExitPoint } = require('@hmcts/one-per-page');

class Done extends ExitPoint {
  static get path() {
    return '/done';
  }

  values() {
    return {
      referenceNumber: 'HDJ2123F',
      husbandOrWife: this.journey.answers
        .filter(s => s.id == 'RespondentTitle')[0].answer
    };
  }
}

module.exports = Done;
