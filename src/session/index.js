const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const config = require('config');
const { isTest } = require('../util/nodeEnv');
const defaultIfUndefined = require('../util/defaultIfUndefined');
const { shimSession } = require('../session/sessionShims');
const { shimSessionStore } = require('../session/sessionStoreShims');

const MemoryStore = expressSession.MemoryStore;

const redisOrInMemory = (options = {}) => {
  const redisOptions = options.redis || {};
  return isTest ? new MemoryStore() : new RedisStore(redisOptions);
};

const sessionOptions = userOpts => {
  const userCookie = userOpts.cookie || {};
  const cookie = Object.assign({}, {
    secure: defaultIfUndefined(userCookie.secure, !isTest),
    expires: defaultIfUndefined(userCookie.expires, false)
  }, userCookie);

  return {
    store: userOpts.store || redisOrInMemory(userOpts),
    secret: defaultIfUndefined(userOpts.secret, config.secret),
    resave: defaultIfUndefined(userOpts.resave, false),
    saveUninitialized: defaultIfUndefined(userOpts.saveUninitialized, false),
    name: defaultIfUndefined(userOpts.name, 'session'),
    cookie
  };
};

const overrides = (req, res, next) => error => {
  if (error) {
    next(error);
    return;
  }
  res.locals = res.locals || {};
  // Should page render be able to access session directly?
  res.locals.session = req.session;

  if (req.session && req.sessionStore) {
    shimSession(req, res);
    shimSessionStore(req);
    next();
  } else {
    next(new Error('Store is disconnected'));
  }
};

const sessions = (userOptions = {}) => {
  const options = sessionOptions(userOptions);
  const provider = expressSession(options);
  return (req, res, next) => provider(req, res, overrides(req, res, next));
};

module.exports = sessions;
