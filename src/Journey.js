const session = require('./session');
const { i18nMiddleware } = require('./i18n/i18Next');
const urlParse = require('url-parse');
const defaultIfUndefined = require('./util/defaultIfUndefined');
const { defined } = require('./util/checks');
const logger = require('@log4js-node/log4js-api')
  .getLogger('one-per-page.Journey');

const parseUrl = baseUrl => {
  if (typeof baseUrl === 'undefined') {
    throw new Error('Must provide a baseUrl');
  }
  return urlParse(baseUrl);
};

const constructorFrom = step => {
  if (defined(step.prototype)) {
    return step;
  }
  const { constructor, name } = step;
  logger.warn(`Deprecated: Pass ${name} to journey as class not instance.`);
  return constructor;
};

const options = userOpts => {
  let sessionProvider = null;

  if (typeof userOpts.session === 'function') {
    sessionProvider = userOpts.session;
  } else {
    const cookie = Object.assign(
      { domain: parseUrl(userOpts.baseUrl).hostname },
      userOpts.session.cookie || {}
    );
    const sessionOpts = Object.assign({}, userOpts.session, { cookie });
    sessionProvider = session(sessionOpts);
  }
  const steps = defaultIfUndefined(userOpts.steps, [])
    .map(constructorFrom);

  return {
    baseUrl: userOpts.baseUrl,
    steps,
    session: sessionProvider,
    noSessionHandler: userOpts.noSessionHandler
  };
};

const journey = (app, userOpts) => {
  const opts = options(userOpts);

  const setupMiddleware = (req, res, next) => {
    req.journey = req.journey || {};
    if (typeof opts.noSessionHandler !== 'undefined') {
      req.journey.noSessionHandler = opts.noSessionHandler;
    }
    opts.steps.forEach(step => {
      req.journey[step.name] = step;
    });
    next();
  };

  app.use(setupMiddleware);
  app.use(opts.session);
  app.use(i18nMiddleware);

  opts.steps.forEach(Step => Step.bind(app));

  return app;
};

module.exports = journey;
