const BaseStep = require('./steps/BaseStep');
const Page = require('./steps/Page');
const Journey = require('./Journey');
const path = require('path');

const patterns = () => path.resolve(__dirname, '../templates');

module.exports = {
  Page,
  BaseStep,
  Journey,
  patterns
};
