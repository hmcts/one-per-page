const journey = require('../src/Journey');
const { supertest, testApp } = require('./util/supertest');
const { OK } = require('http-status-codes');
const { expect } = require('./util/chai');
const Page = require('./../src/steps/Page');

const testUrl = '/test/page';
class TestPage extends Page {
  get url() {
    return testUrl;
  }
  get template() {
    return 'Page';
  }
}

describe('Journey', () => {
  it('returns an express app', () => {
    const testJourney = journey(testApp());

    expect(testJourney).to.be.a('function');
    expect(testJourney).itself.to.respondTo('use');
    expect(testJourney).itself.to.respondTo('get');
    expect(testJourney).itself.to.respondTo('post');
  });

  it('binds steps to the router', () => {
    const app = journey(testApp(), { steps: [new TestPage()] });
    return supertest(app).get(testUrl).expect(OK);
  });
});
