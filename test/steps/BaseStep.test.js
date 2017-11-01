const BaseStep = require('./../../src/steps/BaseStep');
const { OK } = require('http-status-codes');
const { testStep } = require('../util/supertest');
const { expect } = require('../util/chai');

const { NotImplemented } = require('../../src/errors/expectImplemented');

describe('steps/BaseStep', () => {
  {
    const unimplementedStep = () => new class extends BaseStep {}();

    it('expects handler to be implemented', () => {
      return expect(unimplementedStep)
        .to.throw(NotImplemented)
        .that.has.property('unimplemented').which.contains('handler');
    });
  }

  describe('#router', () => {
    {
      const step = new class extends BaseStep {
        handler() { /* intentionally empty */ }
      }();

      it('returns an express router', () => {
        expect(step.router).to.be.a('function');
        expect(step.router).itself.to.respondTo('use');
        expect(step.router).itself.to.respondTo('get');
        expect(step.router).itself.to.respondTo('post');
      });

      it('memoises the router', () => {
        expect(step.router).to.eql(step.router);
      });
    }

    it('binds the handler function to the current path', () => {
      const step = new class extends BaseStep {
        handler(req, res) {
          res.status(OK).json({ status: 'ok', path: this.path });
        }
      }();
      return testStep(step).get()
        .expect(OK, { status: 'ok', path: step.path });
    });

    it('binds the current step to req.currentStep', () => {
      const test = new class extends BaseStep {
        handler(req, res) {
          expect(req.currentStep).to.eql(this);
          res.end();
        }
      }();
      return testStep(test).get().expect(OK);
    });
  });

  describe('#middleware', () => {
    it('are executed before the request handler', () => {
      const fooAdder = (req, res, next) => {
        req.foo = 'Foo';
        next();
      };

      const step = new class extends BaseStep {
        get middleware() {
          return [fooAdder];
        }
        handler(req, res) {
          res.status(OK).json({ foo: req.foo });
        }
      }();
      return testStep(step).get()
        .expect(OK, { foo: 'Foo' });
    });

    it('are bound to the current step', () => {
      const step = new class Step extends BaseStep {
        scopedMiddleware(req, res, next) {
          req.stepUrl = this.path;
          next();
        }
        get middleware() {
          return [this.scopedMiddleware];
        }
        handler(req, res) {
          res.status(OK).json({ path: req.stepUrl });
        }
      }();

      return testStep(step).get()
        .expect(OK, { path: '/step' });
    });
  });

  describe('#dirname', () => {
    it('returns the path to the file containing the step', () => {
      const step = new class Foo extends BaseStep {
        handler() { /* intentionally blank */ }
      }();
      expect(step.dirname).to.eql(__dirname);
    });
  });

  describe('#path', () => {
    it('defaults to a slugged class name', () => {
      const foo = new class Foo extends BaseStep {
        handler() { /* intentionally blank */ }
      }();
      expect(foo.path).to.eql('/foo');

      const fooBar = new class FooBar extends BaseStep {
        handler() { /* intentionally blank */ }
      }();
      expect(fooBar.path).to.eql('/foo-bar');
      const base = new class extends BaseStep {
        handler() { /* intentionally blank */ }
      }();
      expect(base.path).to.eql('/base-step');
    });

    it('is backwards compatible to old #url', () => {
      const step = new class extends BaseStep {
        get url() {
          return '/test-step';
        }
        handler() { /* intentionally blank */ }
      }();
      expect(step.path).to.eql('/test-step');
    });
  });
});
