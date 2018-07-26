const proxyquire = require('proxyquire');
const { journey } = require('../../src/flow');
const { supertest, testApp } = require('../util/supertest');
const { OK } = require('http-status-codes');
const { expect, sinon } = require('../util/chai');
const Page = require('../../src/steps/Page');
const session = require('../../src/session');

class TestPage extends Page {}
const defaultOptions = {
  session: { secret: 'foo' },
  baseUrl: 'http://localhost'
};
const options = (...overrides) => {
  const foo = Object.assign(
    {},
    defaultOptions,
    ...overrides
  );
  return foo;
};
const handlerTest = ({ test, options: extraOptions }) => {
  const testPage = class extends TestPage {
    get name() {
      return 'TestPage';
    }
    handler(req, res) {
      test(req, res);
      res.end();
    }
  };
  const opts = options({ steps: [testPage] }, extraOptions);
  const app = journey(testApp(), opts);
  return () => supertest(app).get(testPage.path).expect(200);
};


describe('journey/journey', () => {
  it('returns an express app', () => {
    const testJourney = journey(testApp(), defaultOptions);

    expect(testJourney).to.be.a('function');
    expect(testJourney).itself.to.respondTo('use');
    expect(testJourney).itself.to.respondTo('get');
    expect(testJourney).itself.to.respondTo('post');
  });

  it('binds steps to the router', () => {
    const app = journey(testApp(), options({ steps: [TestPage] }));
    return supertest(app).get(TestPage.path).expect(OK);
  });

  describe('req.journey', () => {
    it('is created by journey', handlerTest({
      test(req) {
        expect(req.journey).to.be.an('object');
      }
    }));

    it('binds the noSessionHandler, so sessions can access it', handlerTest({
      options: { noSessionHandler: (req, res, next) => next() },
      test(req) {
        expect(req.journey.noSessionHandler).to.be.a('function');
      }
    }));

    it('binds all steps to req.journey.[step name]', () => {
      const foo = class Foo extends TestPage {};
      const bar = class Bar extends TestPage {};
      return handlerTest({
        options: { steps: [foo, bar] },
        test(req) {
          expect(req.journey).to.have.property('Foo', foo);
          expect(req.journey).to.have.property('Bar', bar);
        }
      });
    });
  });

  describe('session option', () => {
    describe('as a function', () => {
      it('overrides the session middleware', () => {
        const sessionOverride = (req, res) => {
          res.end(`Using override, session: ${req.session}`);
        };
        const app = journey(testApp(), options({ session: sessionOverride }));
        return supertest(app)
          .get('/')
          .expect('Using override, session: undefined');
      });
    });

    describe('as an object', () => {
      it('configures the session middleware', () => {
        const spy = sinon.spy(session);
        const stubbedJourney = proxyquire(
          '../../src/flow/journey',
          { '../session': spy }
        );
        const domain = '127.0.0.1';
        const baseUrl = `http://${domain}`;
        const secret = 'keyboard cat';
        stubbedJourney(testApp(), { baseUrl, session: { secret } });
        expect(spy).calledWith(sinon.match({ secret }));
        expect(spy).calledWith(sinon.match({ cookie: {} }));
      });
    });
  });

  describe('Error pages option', () => {
    let stubbedJourney = null;
    let bindStub = null;

    beforeEach(() => {
      bindStub = sinon.stub().returns(true);
      const errorPagesStubObj = { bind: bindStub };

      stubbedJourney = proxyquire(
        '../../src/flow/journey',
        { '../errors/errorPages': errorPagesStubObj }
      );
    });

    it('should register default error pages', () => {
      const app = testApp();
      stubbedJourney(app, defaultOptions);
      return expect(bindStub).to.have.been.calledWith(app, undefined);
    });

    it('should register configured error pages', () => {
      const errorPagesConfig = { template: 'sometemplate' };
      const app = testApp();

      stubbedJourney(app,
        {
          baseUrl: 'http://localhost',
          session: { secret: 'foo' },
          errorPages: errorPagesConfig
        }
      );

      return expect(bindStub).to.have.been.calledWith(app, errorPagesConfig);
    });
  });
});
