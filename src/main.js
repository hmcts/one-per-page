const BaseStep = require('./steps/BaseStep');
const Page = require('./steps/Page');
const Question = require('./steps/Question');

const journey = require('./Journey');

const requireSession = require('./middleware/requireSession');
const parseRequest = require('./middleware/parseRequest');

const { field, form } = require('./services/fields');

module.exports = {
  BaseStep,
  Page,
  Question,
  journey,
  middleware: { requireSession, parseRequest },
  field,
  form
};
