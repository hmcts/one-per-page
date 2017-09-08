const { expect, sinon } = require('../util/chai');
const destroySession = require('../../src/middleware/destroySession');

describe('middleware/destroySession', () => {
  
  it('calls req.session.destroy() to destroy a session', done => {
    const req = { session: { destroy: sinon.stub() } };
    const assertions = () => {
      expect(req.session.destroy).calledOnce;
      done();
    };

    destroySession(req, {}, assertions);
  });

  describe('#session', () => {
    it('throws an error if session is not initialized', done => {
      expect(() => destroySession({}, {}, {})).to.throw('Session not initialized');
      done();
    });
  });
});
