const express = require('express');
const supertest = require('supertest');
const sessions = require('./../../src/services/sessions');
const nunjucks = require('express-nunjucks');
const zepto = require('zepto-node');
const domino = require('domino');

function testApp() {
  const app = express();
  app.set('views', ['lib/', 'test/views']);

  nunjucks(app, {
    autoescape: true,
    watch: true,
    noCache: true
  });

  return app;
}

const cookie = res => {
  const setCookie = res.headers['set-cookie'];
  return (setCookie && setCookie[0]) || undefined;
};

const _supertest = Symbol('supertest');
const _app = Symbol('app');
const _middleware = Symbol('middleware');

const supertestInstance = stepDSL => {
  if (stepDSL[_supertest]) return stepDSL[_supertest];

  const app = testApp();
  stepDSL[_app] = app;

  app.use((req, res, next) => {
    // setup req.journey (added by Journey)
    req.journey = req.journey || {};
    next();
  });

  app.use(sessions({ baseUrl: '127.0.0.1', secret: 'keyboard cat' }));

  app.get('/supertest-check-session', (req, res) => {
    const session = Object.assign(
      {},
      req.session,
      { active: req.session.active() }
    );
    res.end(JSON.stringify(session));
  });

  stepDSL[_middleware].forEach(_ => app.use(_));
  app.use(stepDSL.step.router);
  stepDSL[_supertest] = supertest(app);

  return stepDSL[_supertest];
};

const wrapWithResponseAssertions = supertestObj => {
  supertestObj.html = assertions => {
    return supertestObj.expect(200).then(res => {
      const _window = domino.createWindow(res.text);
      const $ = zepto(_window);
      return assertions($);
    });
  };
  supertestObj.session = assertions => {
    return supertestObj.then(res => {
      const sid = cookie(res);
      return supertest(supertestObj.app)
        .get('/supertest-check-session')
        .set('Cookie', sid)
        .expect(200);
    }).then(res => {
      const session = JSON.parse(res.text);
      return Promise.all([assertions(session)]);
    });
  };
  return supertestObj;
};

class TestStepDSL {
  constructor(step, body = {}, middleware = []) {
    this.step = step;
    this.body = body;
    this[_middleware] = middleware;
  }

  static create(step) {
    return new TestStepDSL(step);
  }

  withSession(session) {
    return this.withMiddleware((req, res, next) => {
      req.session = Object.assign(req.session, session);
      next();
    });
  }

  withField(field, value) {
    const fieldName = `${this.step.name}_${field}`;
    const newBody = Object.assign({}, this.body, { [fieldName]: value });
    return new TestStepDSL(this.step, newBody, this[_middleware]);
  }

  withSetup(setup) {
    return this.withMiddleware((req, res, next) => {
      setup(req, res);
      next();
    });
  }

  withMiddleware(newMiddleware) {
    const middleware = [...this[_middleware], newMiddleware];
    return new TestStepDSL(this.step, this.body, middleware);
  }

  execute(method) {
    const testExecution = supertestInstance(this)[method](this.step.url);
    return wrapWithResponseAssertions(testExecution);
  }

  get() {
    return this.execute('get');
  }
  post() {
    const postRequest = this.execute('post');
    if (Object.keys(this.body).length !== 0) {
      return postRequest.send(this.body);
    }
    return postRequest;
  }
  patch() {
    return this.execute('patch');
  }
  put() {
    return this.execute('put');
  }
  delete() {
    return this.execute('delete');
  }
}

module.exports = {
  supertest,
  testApp,
  testStep: TestStepDSL.create
};
