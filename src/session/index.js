const expressSession = require('express-session');
const RedisStore = require('connect-redis');
const config = require('config');
const { isTest } = require('../util/nodeEnv');
const defaultIfUndefined = require('../util/defaultIfUndefined');
const { shimSession } = require('../session/sessionShims');
const { shimSessionStore } = require('../session/sessionStoreShims');
const { sessionStoreSerializer } = require('../session/sessionStoreSerializer');

const MemoryStore = expressSession.MemoryStore;

const redisOrInMemory = (options = {}) => {
  const redisOptions = options.redis || {};

  if (isTest) {
    return new MemoryStore();
  }

  const client = createClient({
    url: redisOptions.url, // e.g. redis://localhost:6379
    legacyMode: true, // keeps callback API for old code
    socket: redisOptions.socket // optional
  });

  client.on('error', error => {
    console.log(`${new Date().toISOString()} Redis connection failed: ${error.message}`);
  });

  client.connect().catch(error => {
    console.log(`${new Date().toISOString()} Redis connect error: ${error.message}`);
  });

  const store = new RedisStore({ client });

  // Optional retry/backoff
  if (!redisOptions.retry_strategy) {
    client.on('end', () => {
      console.log(`${new Date().toISOString()} Redis client disconnected, attempting reconnect...`);
      setTimeout(() => client.connect().catch(console.error), 1000);
    });
  }

  return store;
};

const sessionOptions = (userOpts, store, req) => {
  const userCookie = userOpts.cookie || {};
  const cookie = Object.assign({}, {
    secure: defaultIfUndefined(userCookie.secure, req.secure),
    expires: defaultIfUndefined(userCookie.expires, false),
    domain: defaultIfUndefined(userCookie.hostname, req.hostname)
  }, userCookie);

  if (userOpts.sessionEncryption) {
    const encryptionKey = userOpts.sessionEncryption(req);
    userOpts.serializer = sessionStoreSerializer(encryptionKey);
  }

  return {
    store,
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

const setupStore = userOptions => {
  if (userOptions.store) {
    return userOptions.store;
  }

  const store = redisOrInMemory(userOptions);


  // Azure Cache for Redis has issues with a 10 minute connection idle timeout, the recommendation is to keep the connection alive
  // https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-node-js-md

  if (store && store.client && typeof store.client.ping === 'function') {
    const oneMinute = 60000;
    setInterval(() => {
      const client = store.client;
      if (client.connected) {
        client.ping();
      }
    }, oneMinute);
    store.client.ping();
  }
  return store;
};

const sessions = (userOptions = {}) => {
  const store = setupStore(userOptions);
  const handler = (req, res, next) => {
    const options = sessionOptions(userOptions, store, req);
    const provider = expressSession(options);
    provider(req, res, overrides(req, res, next));
  };
  return handler;
};

module.exports = sessions;
