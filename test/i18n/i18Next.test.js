const { expect } = require('../util/chai');
const i18Next = require('../../src/i18n/i18Next');

describe('i18n/i18Next', () => {
  it('exposes an instance of i18Next', () => {
    expect(i18Next).to.be.an('object');
    expect(i18Next).to.have.property('t').that.is.a('function');
    expect(i18Next).to.have.property('addResourceBundle').that.is.a('function');
  });
});
