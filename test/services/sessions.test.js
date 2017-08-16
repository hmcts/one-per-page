const sessions = require('../../src/services/sessions');
const { expect } = require('../util/chai');
const { testApp, supertest } = require('../util/supertest');
const { MemoryStore } = require('express-session');
const { OK } = require('http-status-codes');

describe('services/sessions', () => {
  it('presents an express middleware', () => {
    const s = sessions();
    expect(s).to.be.a('function');
  });
  it('accepts express-session session stores', () => {
    const store = new MemoryStore();
    const app = testApp();
    expect(store.sessions).to.be.empty;
    const s = sessions({ store });
    app.use(s);
    app.get('/', (req, res) => {
      req.session.foo = 'foo';
      res.sendStatus(OK);
    });
    return supertest(app)
      .get('/').expect(200)
      .then(response => {
        const cookies = response.headers['set-cookie'];
        expect(cookies).to.include.match(/connect.sid/);
        expect(store.sessions).to.not.be.empty;
      });
  });
  it('only initialises sessions when data is stored', () => {
    const store = new MemoryStore();
    const app = testApp();
    expect(store.sessions).to.be.empty;
    const s = sessions({ store });
    app.use(s);
    app.get('/', (req, res) => {
      res.sendStatus(OK);
    });
    return supertest(app)
      .get('/').expect(200)
      .then(response => {
        const cookies = response.headers['set-cookie'];
        expect(cookies).to.be.undefined;
        expect(store.sessions).to.be.empty;
      });
  });
});
