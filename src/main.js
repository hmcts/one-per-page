const BaseStep = require('./steps/BaseStep');
const Page = require('./steps/Page');
const Question = require('./steps/Question');
const EntryPoint = require('./steps/EntryPoint');
const Redirect = require('./steps/Redirect');

const journey = require('./Journey');

const requireSession = require('./middleware/requireSession');
const parseRequest = require('./middleware/parseRequest');

const { field, form } = require('./services/fields');

const { goTo } = require('./services/flow');

module.exports = {
  EntryPoint,
  Redirect,
  BaseStep,
  Page,
  Question,
  journey,
  middleware: { requireSession, parseRequest },
  field,
  form,
  goTo
};
