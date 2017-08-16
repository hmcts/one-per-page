const express = require('express');
const supertest = require('supertest');
const sessions = require('./../../src/services/sessions');
const nunjucks = require('express-nunjucks');

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

const _supertest = Symbol('supertest');
const _middleware = Symbol('middleware');

const supertestInstance = stepDSL => {
  if (stepDSL[_supertest]) return stepDSL[_supertest];

  const app = testApp();
  app.use(sessions());
  stepDSL[_middleware].forEach(_ => app.use(_));
  app.use(stepDSL.step.router);
  stepDSL[_supertest] = supertest(app);

  return stepDSL[_supertest];
};

class TestStepDSL {
  constructor(step, middleware = []) {
    this.step = step;
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

  withMiddleware(middleware) {
    return new TestStepDSL(this.step, [...this[_middleware], middleware]);
  }

  execute(method) {
    return supertestInstance(this)[method](this.step.url);
  }

  get() {
    return this.execute('get');
  }
  post() {
    return this.execute('post');
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
