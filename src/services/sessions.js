const session = require('express-session');
const config = require('config');
const isTest = require('../util/isTest');

const inmemory = () => session({
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
});

const redis = () => {
  // implement and make configurable from entrypoint
  return {};
};

const sessions = () => {
  const provider = isTest ? inmemory() : redis();
  const middleware = (req, res, next) => {
    provider(req, res, () => {
      res.locals = res.locals || {};
      // Should page render be able to access session directly?
      res.locals.session = req.session;
      next();
    });
  };
  return middleware;
};

sessions.inmemory = inmemory;
sessions.redis = redis;

module.exports = sessions;
