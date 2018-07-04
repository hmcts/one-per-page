const BaseStep = require('./steps/BaseStep');
const Page = require('./steps/Page');
const Question = require('./steps/Question');
const EntryPoint = require('./steps/EntryPoint');
const ExitPoint = require('./steps/ExitPoint');
const Redirect = require('./steps/Redirect');
// eslint-disable-next-line max-len
const QuestionWithRequiredNextSteps = require('./steps/QuestionWithRequiredNextSteps');

const requireSession = require('./session/requireSession');

const { field, form, checkboxField } = require('./forms');

const { goTo, branch, journey } = require('./flow');

module.exports = {
  EntryPoint,
  ExitPoint,
  Redirect,
  BaseStep,
  Page,
  Question,
  QuestionWithRequiredNextSteps,
  journey,
  middleware: { requireSession },
  field,
  checkboxField,
  form,
  goTo,
  branch
};
