const sessions = require('../../src/services/sessions');
const { expect } = require('../util/chai');
const { testApp, supertest } = require('../util/supertest');
const { MemoryStore } = require('express-session');
const { OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');

const respondOk = (req, res) => res.sendStatus(OK);
const handleError = (res, next) => {
  return error => {
    if (error && !res._header) {
      res.statusCode = error.status || INTERNAL_SERVER_ERROR;
      res.end(error.message);
    } else {
      next();
    }
  };
};

const createServer = (options, {
  respond = respondOk,
  setup = () => { /* intentionally blank */ }
} = {}) => {
  const cookieOptions = Object.assign({ maxAge: 60 * 1000 }, options.cookie);
  const opts = Object.assign({}, { secret: 'keyboard cat' }, options);
  opts.cookie = cookieOptions;
  const s = sessions(opts);
  const app = testApp();

  app.use((req, res, next) => {
    setup(req, res);
    next();
  });
  app.use((req, res, next) => {
    s(req, res, handleError(res, next));
  });
  app.use(respond);

  return app;
};

const shouldNotSetCookie = name => {
  return res => Promise.all([
    expect(Object.keys(res.headers)).to.not.include('set-cookie'),
    expect(res.headers['set-cookie']).to.not.include.match(name)
  ]);
};

const shouldSetCookie = name => {
  return res => Promise.all([
    expect(Object.keys(res.headers)).to.include('set-cookie'),
    expect(res.headers['set-cookie']).to.include.match(name)
  ]).then(() => res);
};

const cookie = res => {
  const setCookie = res.headers['set-cookie'];
  return (setCookie && setCookie[0]) || undefined;
};

const shouldHave = number => {
  return {
    sessionsIn(store) {
      return res => {
        const promise = new Promise((resolve, reject) => {
          store.all((error, sess) => {
            if (error) {
              reject(error);
            } else {
              const currentSessions = Object.keys(sess).length;
              resolve(expect(currentSessions).to.eql(number));
            }
          });
        });
        return promise.then(() => res);
      };
    }
  };
};

describe('services/sessions', () => {
  it('presents an express middleware', () => {
    const s = sessions();
    expect(s).to.be.a('function');
  });

  it('bubbles up express-session errors', () => {
    const app = createServer({ secret: undefined });
    return supertest(app)
      .get('/')
      .expect(500);
  });

  it('creates sessions when session.generate is called', () => {
    const store = new MemoryStore();
    const app = createServer({ store }, {
      respond(req, res) {
        req.session.generate();
        res.end();
      }
    });
    return supertest(app)
      .get('/')
      .expect(200)
      .expect(shouldSetCookie(/session/))
      .then(shouldHave(1).sessionsIn(store));
  });

  it('initialises sessions when data is stored', () => {
    const store = new MemoryStore();
    const app = createServer({ store });
    return supertest(app)
      .get('/')
      .expect(200)
      .expect(shouldNotSetCookie(/session/))
      .then(shouldHave(0).sessionsIn(store));
  });

  it('destroys an existing session on generate', () => {
    const store = new MemoryStore();
    const app = createServer({ store }, {
      respond(req, res) {
        req.session.generate();
        res.end();
      }
    });
    return supertest(app)
      .get('/')
      .expect(200)
      .then(first => {
        return supertest(app)
          .get('/')
          .set('Cookie', cookie(first))
          .expect(200)
          .expect(shouldSetCookie(/session/))
          .then(second => expect(cookie(first)).to.not.eql(cookie(second)));
      })
      .then(shouldHave(1).sessionsIn(store));
  });

  it('loads sessions correctly', () => {
    const store = new MemoryStore();
    const app = createServer({ store }, {
      respond(req, res) {
        if (req.session.active()) {
          res.end('session loaded');
        } else {
          req.session.generate();
          res.end('session created');
        }
      }
    });
    return supertest(app)
      .get('/')
      .expect(200, 'session created')
      .then(first => {
        return supertest(app)
          .get('/')
          .set('Cookie', cookie(first))
          .expect(200, 'session loaded');
      })
      .then(shouldHave(1).sessionsIn(store));
  });
});
