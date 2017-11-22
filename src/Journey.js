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

class RequestBoundJourney {
  constructor(req, res, steps, settings) {
    this.req = req;
    req.journey = this;
    this.res = res;
    this.steps = steps;
    this.settings = settings;
    this.instances = {};
  }

  instance(Step) {
    if (defined(this.instances[Step.name])) {
      return this.instances[Step.name];
    }
    this.instances[Step.name] = new Step(this.req, this.res);
    return this.instances[Step.name];
  }
}

const journey = (app, userOpts) => {
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

  app.use(setupMiddleware);
  app.use(opts.session);
  app.use(i18nMiddleware);

  opts.steps.forEach(Step => Step.bind(app));

  return app;
};

journey.RequestBoundJourney = RequestBoundJourney;

module.exports = journey;
