const { AddAnother } = require('@hmcts/one-per-page/steps');
const { date, convert } = require('@hmcts/one-per-page/forms');
const { goTo } = require('@hmcts/one-per-page/flow');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const moment = require('moment');

class DatesYouCantAttend extends AddAnother {
  get field() {
    return convert(
      d => moment(`${d.year}-${d.month}-${d.day}`, 'YYYY-MM-DD'),
      date
    ).check('Must be in the future', _date => _date.isAfter(moment.now()));
  }

  validateList(list) {
    return list.check('Enter atleast 1 date', arr => arr.length > 0);
  }

  answers() {
    return answer(this, {
      question: "Dates you can't attend a court hearing",
      answer: this.fields.items.value.map(d => d.format('DD/MM/YYYY'))
    });
  }

  values() {
    const utfStamps = this.fields.items.value.map(d => d.format('YYYY-MM-DD'));
    if (utfStamps.length === 0) {
      return {};
    }
    return { unavailableDates: utfStamps };
  }

  next() {
    return goTo(this.journey.steps.CheckYourAnswers);
  }
}

module.exports = DatesYouCantAttend;
