const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text, ref } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');

class Name extends Question {
  get form() {
    return form({
      firstName: text.joi(
        this.content.fields.firstName.required,
        Joi.string().required()
      ),
      lastName: text.joi(
        this.content.fields.lastName.required,
        Joi.string().required()
      ),
      husbandOrWife: ref(this.journey.steps.RespondentTitle, text),
      respondentFirstName: text.joi(
        this.content.fields.respondentFirstName.required,
        Joi.string().required()
      ),
      respondentLastName: text.joi(
        this.content.fields.respondentLastName.required,
        Joi.string().required()
      )
    });
  }

  get husbandOrWife() {
    if (typeof this.fields.husbandOrWife.value !== 'undefined') {
      return this.fields.husbandOrWife.value;
    }
    return 'husband/wife';
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.petitioner.question,
        section: 'personal-details',
        answer: `${this.fields.firstName.value} ${this.fields.lastName.value}`
      }),
      answer(this, {
        question: this.content.cya.respondent.question,
        section: 'respondent-details',
        answer: [
          this.fields.respondentFirstName.value,
          this.fields.respondentLastName.value
        ].join(' ')
      })
    ];
  }

  values() {
    return {
      petitioner: {
        firstName: this.fields.firstName.value,
        lastName: this.fields.lastName.value
      },
      respondent: {
        firstName: this.fields.respondentFirstName.value,
        lastName: this.fields.respondentLastName.value
      }
    };
  }

  next() {
    return goTo(this.journey.steps.Contact);
  }
}

module.exports = Name;
