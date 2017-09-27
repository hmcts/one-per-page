const session = require('./session');
const urlParse = require('url-parse');
const defaultIfUndefined = require('./util/defaultIfUndefined');

const parseUrl = baseUrl => {
  if (typeof baseUrl === 'undefined') {
    throw new Error('Must provide a baseUrl');
  }
  return urlParse(baseUrl);
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

  return {
    baseUrl: userOpts.baseUrl,
    steps: defaultIfUndefined(userOpts.steps, []),
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

  opts.steps.forEach(step => {
    app.use(step.router);
  });

  return app;
};

module.exports = journey;
