const { Question } = require('@hmcts/one-per-page/steps');
const { form, date, convert } = require('@hmcts/one-per-page/forms');
const { branch, goTo } = require('@hmcts/one-per-page/flow');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const moment = require('moment');

class DateOfMarriage extends Question {
  get form() {
    return form({
      date: convert(
        d => moment(`${d.year}-${d.month}-${d.day}`, 'YYYY-MM-DD'),
        date.required({
          allRequired: this.content.date.allRequired,
          dayRequired: this.content.date.dayRequired,
          monthRequired: this.content.date.monthRequired,
          yearRequired: this.content.date.yearRequired
        })
      )
    });
  }

  get today() {
    return moment().format('D M YYYY');
  }

  next() {
    const oneYearAgo = moment().subtract(1, 'year');
    const marriedLessThan1Year = this.fields.date.value.isAfter(oneYearAgo);

    return branch(
      goTo(this.journey.steps.ExitDate).if(marriedLessThan1Year),
      goTo(this.journey.steps.Country)
    );
  }

  answers() {
    return answer(this, {
      question: this.content.date.question,
      answer: this.fields.date.value.format('DD/MM/YYYY')
    });
  }

  values() {
    return { marriage: { date: this.fields.date.value.format('YYYY-MM-DD') } };
  }
}

module.exports = DateOfMarriage;
