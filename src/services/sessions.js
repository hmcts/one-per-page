const session = require('express-session');
const config = require('config');
const shims = require('./sessions/shims');

const expressSession = options => {
  const settings = Object.assign({}, {
    store: new session.MemoryStore(),
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    name: 'session',
    cookie: { secure: false }
  }, options);
  return session(settings);
};

const overrides = (req, res, next) => error => {
  if (error) {
    next(error);
    return;
  }
  res.locals = res.locals || {};
  // Should page render be able to access session directly?
  res.locals.session = req.session;

  req.session.generate = shims.generate(req);
  req.session.active = shims.active(req);
  req.sessionStore.set = shims.set(req);
  req.sessionStore.get = shims.get(req);
  req.sessionStore.createSession = shims.createSession(req);

  next();
};

const sessions = (options = {}) => {
  const provider = expressSession(options);
  return (req, res, next) => provider(req, res, overrides(req, res, next));
};

module.exports = sessions;
