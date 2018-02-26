const colors = require('colors/safe');
const debug = require('debug');

// eslint-disable-next-line no-console
const log = (prefix, ...args) => console.log(prefix, ':', ...args);

module.exports = prefix => {
  try {
    // eslint-disable-next-line global-require
    const logger = require('@hmcts/nodejs-logging').getLogger(prefix);

    debug('look-and-feel.logging')('Using @hmcts/nodejs-logging for logging');
    return {
      info(...args) {
        return logger.info(...args);
      },
      warn(...args) {
        return logger.warn(...args);
      },
      error(...args) {
        return logger.error(...args);
      }
    };
  } catch (moduleMissing) {
    debug('look-and-feel.logging')('@hmcts/nodejs-loging not found');
    debug('look-and-feel.logging')('Using console.log for logging');
    return {
      info(...args) {
        return log(colors.green(prefix), ...args);
      },
      warn(...args) {
        return log(colors.yellow(prefix), ...args);
      },
      error(...args) {
        return log(colors.red(prefix), ...args);
      },
      debug: debug(prefix)
    };
  }
};
