const session = require('../session');
const { i18nMiddleware } = require('../i18n/i18Next');
const errorPages = require('../errors/errorPages');
const defaultIfUndefined = require('../util/defaultIfUndefined');
const { defined } = require('../util/checks');
const RequestBoundJourney = require('./RequestBoundJourney');
const log = require('../util/logging')('journey');
const cookieParser = require('cookie-parser');

const constructorFrom = step => {
  if (defined(step.prototype)) {
    return step;
  }
  const { constructor, name } = step;
  log.warn(`Deprecated: Pass ${name} to journey as class not instance.`);
  return constructor;
};

const options = userOpts => {
  let sessionProvider = null;

  if (typeof userOpts.session === 'function') {
    sessionProvider = userOpts.session;
  } else {
    const sessionOpts = Object.assign({ cookie: {} }, userOpts.session);
    sessionProvider = session(sessionOpts);
  }
  const steps = defaultIfUndefined(userOpts.steps, [])
    .map(constructorFrom);

  return Object.assign({}, userOpts, {
    steps,
    session: sessionProvider,
    noSessionHandler: userOpts.noSessionHandler
  });
};

const journey = (app, userOpts) => {
  log.debug('Initialising journey');

  const opts = options(userOpts);
  const steps = opts.steps
    .map(step => {
      return { [step.name]: step };
    })
    .reduce((left, right) => Object.assign(left, right), {});

  const setupMiddleware = (req, res, next) => {
    req.journey = new RequestBoundJourney(req, res, steps, opts);
    if (typeof opts.noSessionHandler !== 'undefined') {
      req.journey.noSessionHandler = opts.noSessionHandler;
    }
    next();
  };

  app.use(cookieParser());
  app.use(setupMiddleware);
  app.use(opts.session);
  app.use(i18nMiddleware);

  opts.steps.forEach(Step => Step.bind(app));
  errorPages.bind(app, userOpts.errorPages);

  log.debug('Finished initialising journey');
  return app;
};

module.exports = journey;
