const { expect, sinon } = require('../util/chai');
const destroySession = require('../../src/middleware/destroySession');

describe('middleware/destroySession', () => {
  it('calls req.session.destroy() to destroy a session', done => {
    const req = { session: { destroy: sinon.stub() } };
    const res = {};
    const next = () => {
      expect(req.session.destroy).calledOnce;
      done();
    };

    destroySession(req, res, next);
  });

  describe('#session', () => {
    it('throws an error if session is not initialized', () => {
      const noSessionInReq = () => destroySession({}, {}, {});
      expect(noSessionInReq).to.throw('Session not initialized');
    });
  });
});
