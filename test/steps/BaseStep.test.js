const BaseStep = require('./../../src/steps/BaseStep');
const {testStep} = require('../util/supertest');
const {expect} = require('../util/chai');

const {NotImplemented} = require('../../src/errors/expectImplemented');

describe('Step', () => {
  {
    const unimplementedStep = () => {
      new class extends BaseStep {}();
    };
    it('expects url to be implemented', () => {
      return expect(unimplementedStep)
        .to.throw(NotImplemented)
        .that.has.property('unimplemented').which.contains('url');
    });
    it('expects handler to be implemented', () => {
      return expect(unimplementedStep)
        .to.throw(NotImplemented)
        .that.has.property('unimplemented').which.contains('handler');
    });
  }

  describe('#router', () => {
    const step = new class extends BaseStep {
      get url() { return '/step'; }
      handler() {}
    };

    it('returns an express router', () => {
      expect(step.router).to.be.a('function');
      expect(step.router).itself.to.respondTo('use');
      expect(step.router).itself.to.respondTo('get');
      expect(step.router).itself.to.respondTo('post');
    });

    it('memoises the router', () => {
      expect(step.router).to.eql(step.router);
    });

    it('binds the handler function to the current url', () => {
      const step = new class extends BaseStep {
        get url() { return '/step'; }
        handler(req, res) {
          res.status(200).json({ status: 'ok', url: this.url});
        }
      }();
      return testStep(step).get()
        .expect(200, { status: 'ok', url: step.url });
    });
  });

  describe('#middleware', () => {
    it('are executed before the request handler', () => {
      const fooAdder = (req, res, next) => {
        req.foo = 'Foo';
        next();
      };

      const step = new class extends BaseStep {
        get middleware() { return [fooAdder]; }
        get url() { return '/step'; }
        handler(req, res) {
          res.status(200).json({ foo: req.foo });
        }
      }();
      return testStep(step).get()
        .expect(200, { foo: 'Foo' });
    });

    it('are bound to the current step', () => {
      const step = new class extends BaseStep {
        scopedMiddleware(req, res, next) {
          req.stepUrl = this.url;
          next();
        }
        get middleware() { return [this.scopedMiddleware]; }
        get url() { return '/step'; }
        handler(req, res) {
          res.status(200).json({ url: req.stepUrl });
        }
      }();

      return testStep(step).get()
        .expect(200, { url: '/step' });
    });
  });
});
