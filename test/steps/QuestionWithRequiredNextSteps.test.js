const { expect, sinon } = require('../util/chai');
const { NotImplemented } = require('../../src/errors/expectImplemented');
// eslint-disable-next-line max-len
const QuestionWithRequiredNextSteps = require('../../src/steps/QuestionWithRequiredNextSteps');

describe('steps/QuestionWithRequiredNextSteps', () => {
  const req = { journey: {}, method: 'POST' };
  const res = {};

  describe('flowControl', () => {
    it('flowControl returns a TreeWalker', () => {
      const step = new class extends QuestionWithRequiredNextSteps {
        requiredNextSteps() {
          return [];
        }
      }(req, res);

      const flowControl = step.flowControl;

      expect(flowControl.constructor.name).to.be.equal('TreeWalker');
    });
  });

  describe('requiredNextSteps', () => {
    const step = () =>
      new class extends QuestionWithRequiredNextSteps {}(req, res);

    it('expects requiredNextSteps to be implemented', () => {
      return expect(step)
        .to.throw(NotImplemented);
    });
  });

  describe('middleware', () => {
    const nextSteps = [1, 2, 3];
    let step = null;

    beforeEach(() => {
      step = new class extends QuestionWithRequiredNextSteps {
        requiredNextSteps() {
          return nextSteps;
        }
      }(req, res);
    });

    it('expects extra middleware step to be added', () => {
      const middleware = step.middleware;

      return expect(middleware.length).to.equal(7);
    });

    it('next called and forceShow set for POST requests', () => {
      const middleware = step.middleware;
      const requiredNextStepMiddleware = middleware[middleware.length - 1];

      const next = sinon.stub();

      requiredNextStepMiddleware.call(step, req, res, next);

      expect(next).to.be.called;
      expect(req.journey.forceShow).to.equal(nextSteps);
    });

    it('forceShow not set for non GET requests', () => {
      const middleware = step.middleware;
      const requiredNextStepMiddleware = middleware[middleware.length - 1];

      const next = sinon.stub();

      const getRequest = { method: 'GET', journey: {} };
      requiredNextStepMiddleware.call(step, getRequest, res, next);

      expect(next).to.be.called;
      expect(getRequest.journey.forceShow).to.equal(undefined);
    });
  });
});