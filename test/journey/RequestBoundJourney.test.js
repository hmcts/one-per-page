const { expect } = require('../util/chai');
const RequestBoundJourney = require('../../src/journey/RequestBoundJourney');
const BaseStep = require('../../src/steps/BaseStep');

describe('journey/RequestBoundJourney', () => {
  it('sets itself to req.journey', () => {
    const req = {};
    const res = {}, steps = {}, settings = {};
    const journey = new RequestBoundJourney(req, res, steps, settings);
    expect(req.journey).to.eql(journey);
  });

  describe('#instance', () => {
    const Step = class extends BaseStep {
      handler(/* req, res */) { /* intentionally blank */ }
    };
    const req = {};
    const res = {};
    const steps = { Step };
    const settings = {};

    it('returns an instance of the given step', () => {
      const journey = new RequestBoundJourney(req, res, steps, settings);
      expect(journey.instance('Step')).an.instanceof(Step);
    });

    it('accepts a Step class', () => {
      const journey = new RequestBoundJourney(req, res, steps, settings);
      expect(journey.instance(Step)).an.instanceof(Step);
    });

    it('throws if given a Step that hasn\'t been registered', () => {
      const UnknownStep = class extends BaseStep {
        handler(/* req, res */) { /* intentionally blank */ }
      };
      const journey = new RequestBoundJourney(req, res, steps, settings);
      const creatingUnknownStep = () => journey.instance(UnknownStep);

      expect(creatingUnknownStep).to.throw(/UnknownStep not registered/);
    });

    it('throws if given an object that isn\'t a step', () => {
      const journey = new RequestBoundJourney(req, res, steps, settings);
      const arbitraryObj = () => journey.instance({});

      expect(arbitraryObj).to.throw(/is not a step/);
    });
  });
});
