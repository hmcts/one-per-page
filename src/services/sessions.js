const session = require('express-session');
const config = require('config');
const isTest = require('../util/isTest');

const expressSession = options => {
  const settings = Object.assign({}, {
    store: new session.MemoryStore(),
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }, options);
  return session(settings);
};

const overrides = (req, res, next) => () => {
  res.locals = res.locals || {};
  // Should page render be able to access session directly?
  res.locals.session = req.session;
  next();
};

const sessions = (options = {}) => {
  const provider = expressSession(options);
  return (req, res, next) => {
    provider(req, res, overrides(req, res, next));
  };
};

module.exports = sessions;
