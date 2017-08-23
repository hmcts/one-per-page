const BaseStep = require('./steps/BaseStep');
const Page = require('./steps/Page');
const journey = require('./Journey');
const requireSession = require('./middleware/requireSession');

module.exports = {
  Page,
  BaseStep,
  journey,
  middleware: { requireSession }
};
