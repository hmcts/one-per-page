const { expect, sinon } = require('../util/chai');
const createSession = require('../../src/middleware/destroySession');

describe('middleware/destroySession', () => {
  it('calls req.session.destroy to destroy a session', done => {
    const req = { session: { generate: sinon.stub() } };
    const assertions = () => {
      expect(req.session.destroy).calledOnce;
      done();
    };

    createSession(req, {}, assertions);
  });
});
