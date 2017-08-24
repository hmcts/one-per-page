const { expect, sinon } = require('../util/chai');
const { testStep } = require('../util/supertest');
const Page = require('../../src/steps/Page');
const parseRequest = require('../../src/middleware/parseRequest');
const { field } = require('../../src/services/fields.js');

const handlerTest = ({ handler, fields }) => {
  const _step = new class extends Page {
    get middleware() {
      return [parseRequest];
    }
    get url() {
      return '/test';
    }
    get fields() {
      return fields;
    }
    handler(req, res) {
      handler(req, res);
      res.end();
    }
  }();
  return testStep(_step).get().expect(200);
};

describe('middleware/parseRequest', () => {
  describe('req.fields', () => {
    it('is empty if step.fields is empty', () => {
      return handlerTest({
        fields: [],
        handler(req) {
          expect(req.fields).to.be.an('object');
          expect(req.fields).to.be.empty;
        }
      });
    });

    it('is empty if step.fields is not defined', () => {
      const step = new class extends Page {
        get middleware() {
          return [parseRequest];
        }
        get url() {
          return '/test';
        }
        handler(req, res) {
          expect(req.fields).to.be.an('object');
          expect(req.fields).to.be.empty;
          res.end();
        }
      }();

      return testStep(step).get().expect(200);
    });

    it('has a field for each declared field', () => {
      return handlerTest({
        fields: [field('foo'), field('bar')],
        handler(req) {
          expect(req.fields).to.have.keys(['foo', 'bar']);
        }
      });
    });

    it('calls #parse for each field', () => {
      const fakeField = field('fake');
      sinon.spy(fakeField, 'parse');
      return handlerTest({
        fields: [fakeField],
        handler(req) {
          expect(req.fields).to.have.key('fake');
          expect(req.fields.fake).to.have.property('name', 'fake');
        }
      }).then(() => expect(fakeField.parse).calledOnce);
    });
  });
});
