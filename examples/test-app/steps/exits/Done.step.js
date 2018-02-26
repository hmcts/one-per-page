const { ExitPoint } = require('@hmcts/one-per-page');

class Done extends ExitPoint {
  static get path() {
    return '/done';
  }

  values() {
    return {
      referenceNumber: 'HDJ2123F',
      husbandOrWife: this.journey.getField('husbandOrWife', this.journey.steps.RespondentTitle)
    };
  }
}

module.exports = Done;
