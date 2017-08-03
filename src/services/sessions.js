const session = require('express-session');
const config = require('config');

const inmemory = () => {
  return session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false
    }
  });
};

const redis = () => {
  return {}; //TODO: implement and make configurable from entrypoint
};

const sessions = () => {
  const session = process.env.NODE_ENV === 'testing' ? inmemory() : redis();
  const middleware = (req, res, next) => {
    session(req, res, () => {
      res.locals = res.locals || {};
      res.locals.session = req.session; //TODO: Should page render be able to access session directly?
      next();
    });
  };
  return middleware;
};

sessions.inmemory = inmemory;
sessions.redis = redis;

module.exports = sessions;
