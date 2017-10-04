const { expect } = require('./chai');
const path = require('path');
const { fileExists } = require('../../src/util/fs');

describe('util/fs', () => {
  describe('#fileExists', () => {
    it('resolves if the file exists', () => {
      const file = path.resolve(__dirname, '../views/TestPage.html');
      return expect(fileExists(file)).to.become(file);
    });

    it('rejects if the file doesnt exist', () => {
      const file = path.resolve(__dirname, './nonexistantfile');
      return expect(fileExists(file)).to.eventually.be.rejected;
    });

    it('rejects if the path isnt a file', () => {
      const file = path.resolve(__dirname, '.');
      return expect(fileExists(file)).to.eventually.be.rejected;
    });
  });
});
