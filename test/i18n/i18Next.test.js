const { expect } = require('../util/chai');
const { i18NextInstance, i18nMiddleware } = require('../../src/i18n/i18Next');

describe('i18n/i18Next', () => {
  describe('i18nMiddleware', () => {
    it('exposes an express middleware', () => {
      expect(i18nMiddleware).to.be.a('function');
      expect(i18nMiddleware.toString()).to.match(/req,res,next/);
    });

    const executeMiddleware = ({
      req = {},
      res = {}
    } = {}) => new Promise((resolve, reject) => {
      const next = error => {
        if (error) {
          reject(error);
        } else {
          resolve({ req, res });
        }
      };
      i18nMiddleware(req, res, next);
    });

    it('does nothing if req.i18Next exists', () => {
      return executeMiddleware({ req: { i18Next: {} } })
        .then(({ req }) => expect(req.i18Next).to.not.eql(i18NextInstance));
    });

    it('attaches i18Next to req.i18Next', () => {
      return executeMiddleware()
        .then(({ req }) => expect(req.i18Next).to.eql(i18NextInstance));
    });
  });


  describe('i18NextInstance', () => {
    it('exposes an instance of i18Next', () => {
      expect(i18NextInstance).to.be.an('object');
      expect(i18NextInstance).to.have.property('t').that.is.a('function');
      expect(i18NextInstance)
        .to.have.property('addResourceBundle').that.is.a('function');
    });
  });
});
