const BaseStep = require('./steps/BaseStep');
const Page = require('./steps/Page');
const Question = require('./steps/Question');
const EntryPoint = require('./steps/EntryPoint');
const ExitPoint = require('./steps/ExitPoint');
const Redirect = require('./steps/Redirect');

const journey = require('./Journey');

const requireSession = require('./session/requireSession');
const parseRequest = require('./forms/parseRequest');

const { field, form, checkboxField } = require('./forms');

const { goTo, branch } = require('./flow');

module.exports = {
  EntryPoint,
  ExitPoint,
  Redirect,
  BaseStep,
  Page,
  Question,
  journey,
  middleware: { requireSession, parseRequest },
  field,
  checkboxField,
  form,
  goTo,
  branch
};
