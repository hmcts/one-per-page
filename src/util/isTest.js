const config = require('config');

const isTest = config.NODE_ENV === 'testing';

module.exports = { isTest };
