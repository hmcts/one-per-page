const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const config = require('config');
const { isTest } = require('../util/isTest');
const shims = require('./sessions/shims');

const MemoryStore = session.MemoryStore;

const redisOrInMemory = (options = {}) => {
  const redisOptions = options.redis || {};
  return isTest ? new MemoryStore() : new RedisStore(redisOptions);
};

const defaultIfUndefined = (property, defaultValue) => {
  if (typeof property === 'undefined') {
    return defaultValue;
  }
  return property;
};

const expressSession = opts => {
  const userCookie = opts.cookie || {};
  const cookie = Object.assign({}, userCookie, {
    secure: defaultIfUndefined(userCookie.secure, !isTest),
    expires: defaultIfUndefined(userCookie.expires, false)
  });

  const store = opts.store || redisOrInMemory(opts);
  const secret = defaultIfUndefined(opts.secret, config.secret);
  const resave = defaultIfUndefined(opts.resave, false);
  const saveUninitialized = defaultIfUndefined(opts.saveUninitialized, false);
  const name = defaultIfUndefined(opts.name, 'session');

  const settings = { store, secret, resave, saveUninitialized, name, cookie };
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

  if (req.session && req.sessionStore) {
    shims.shimSession(req);
    req.sessionStore.set = shims.set(req);
    req.sessionStore.get = shims.get(req);
    req.sessionStore.createSession = shims.createSession(req);
    next();
  } else {
    next(new Error('Store is disconnected'));
  }
};

const sessions = (options = {}) => {
  const provider = expressSession(options);
  return (req, res, next) => provider(req, res, overrides(req, res, next));
};

module.exports = sessions;
