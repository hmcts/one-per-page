const { expect, sinon } = require('../util/chai');
const AddAnother = require('./../../src/steps/AddAnother');
const { testStep } = require('../util/supertest');
const {
  OK,
  MOVED_TEMPORARILY,
  METHOD_NOT_ALLOWED,
  UNPROCESSABLE_ENTITY
} = require('http-status-codes');
const { text, object } = require('../../src/forms');
const { errorFor } = require('../../src/forms/validator');
const { redirectTo } = require('../../src/flow');

describe('steps/AddAnother', () => {
  class AddAText extends AddAnother {
    get field() {
      return text;
    }
    get template() {
      return require.resolve('../views/AddAText.template.html');
    }

    next() {
      return redirectTo({ path: '/next-step' });
    }
  }

  describe('constructor', () => {
    it('throws if #field is not defined', () => {
      const req = { journey: {} };
      const res = {};
      const willThrow = () => new AddAnother(req, res);
      expect(willThrow).to.throw(/must implement field/);
    });
  });

  {
    const req = { journey: {} };
    const res = {};

    describe('#isListMode', () => {
      it('returns true if mode === list', () => {
        const addAnother = new AddAText(req, res);
        sinon.stub(addAnother, 'mode').get(() => 'list');
        expect(addAnother.isListMode).to.eql(true);
      });

      it('returns false if mode !== list', () => {
        const addAnother = new AddAText(req, res);
        sinon.stub(addAnother, 'mode').get(() => 'foo');
        expect(addAnother.isListMode).to.eql(false);
      });
    });

    describe('#isEditMode', () => {
      it('returns true if mode === edit', () => {
        const addAnother = new AddAText(req, res);
        sinon.stub(addAnother, 'mode').get(() => 'edit');
        expect(addAnother.isEditMode).to.eql(true);
      });

      it('returns false if mode !== edit', () => {
        const addAnother = new AddAText(req, res);
        sinon.stub(addAnother, 'mode').get(() => 'foo');
        expect(addAnother.isEditMode).to.eql(false);
      });
    });

    describe('#isDeleteMode', () => {
      it('returns true if mode === delete', () => {
        const addAnother = new AddAText(req, res);
        sinon.stub(addAnother, 'mode').get(() => 'delete');
        expect(addAnother.isDeleteMode).to.eql(true);
      });

      it('returns false if mode !== delete', () => {
        const addAnother = new AddAText(req, res);
        sinon.stub(addAnother, 'mode').get(() => 'foo');
        expect(addAnother.isDeleteMode).to.eql(false);
      });
    });
  }

  describe('#mode', () => {
    const pathTest = (url, expectedMode) => {
      const params = url.match(AddAText.pathToBind).splice(1, 2);
      const req = { url, params, journey: {} };
      const res = {};
      it(`returns ${expectedMode} if the req.path is ${url}`, () => {
        const addAnother = new AddAText(req, res);
        expect(addAnother.mode).to.eql(expectedMode);
      });
    };

    pathTest('/add-a-text', 'list');
    pathTest('/add-a-text/', 'list');
    pathTest('/add-a-text/item-0', 'edit');
    pathTest('/add-a-text/item-0/', 'edit');
    pathTest('/add-a-text/item-0/delete', 'delete');
    pathTest('/add-a-text/item-0/delete/', 'delete');
  });

  describe('#index', () => {
    const indexTest = (url, expectedIndex) => {
      const params = url.match(AddAText.pathToBind).splice(1, 2);
      const req = { url, params, journey: {} };
      const res = {};
      it(`returns ${expectedIndex} if the req.path is ${url}`, () => {
        const addAnother = new AddAText(req, res);
        expect(addAnother.index).to.eql(expectedIndex);
      });
    };

    indexTest('/add-a-text/item-0', 0);
    indexTest('/add-a-text/item-1', 1);
    indexTest('/add-a-text/item-99', 99);
    indexTest('/add-a-text/item-10101010', 10101010);
    indexTest('/add-a-text/', -1);
  });

  describe('#postUrl', () => {
    const req = { journey: {} };
    const res = {};

    it('returns /[step name]', () => {
      const addAnother = new AddAText(req, res);
      sinon.stub(addAnother, 'mode').get(() => 'list');
      expect(addAnother.postUrl).to.eql('/add-a-text');
    });

    it('returns /[step name]/[index] if in edit mode', () => {
      const addAnother = new AddAText(req, res);
      sinon.stub(addAnother, 'mode').get(() => 'edit');
      sinon.stub(addAnother, 'index').get(() => 0);
      expect(addAnother.postUrl).to.eql('/add-a-text/item-0');
    });
  });

  describe('#deleteUrl', () => {
    const req = { journey: {} };
    const res = {};
    const addAText = new AddAText(req, res);

    it('returns /[step name]/item-[index]/delete', () => {
      expect(addAText.deleteUrl(1)).to.eql('/add-a-text/item-1/delete');
    });
  });

  describe('#editUrl', () => {
    const req = { journey: {} };
    const res = {};
    const addAText = new AddAText(req, res);

    it('returns /[step name]/item-[index]', () => {
      expect(addAText.editUrl(1)).to.eql('/add-a-text/item-1');
    });
  });

  describe('#addAnotherUrl', () => {
    const url = '/add-a-text';
    const params = url.match(AddAText.pathToBind).splice(1, 2);
    const res = {};

    it('returns /[step name]/item-0 if fields.items = []', () => {
      const req = {
        url, params, journey: {},
        session: { AddAText: { items: [] } }
      };
      const addAnother = new AddAText(req, res);
      addAnother.retrieve();
      expect(addAnother.addAnotherUrl).to.eql('/add-a-text/item-0');
    });

    it('returns /[step name]/item-1 if field.items has 1 item', () => {
      const req = {
        url, params, journey: {},
        session: { AddAText: { items: ['foo'] } }
      };
      const addAnother = new AddAText(req, res);
      addAnother.retrieve();
      expect(addAnother.addAnotherUrl).to.eql('/add-a-text/item-1');
    });

    it('returns /[stepName]/item-0 if items not defined', () => {
      const req = { url, params, journey: {}, session: {} };
      const addAnother = new AddAText(req, res);
      addAnother.retrieve();
      expect(addAnother.addAnotherUrl).to.eql('/add-a-text/item-0');
    });
  });

  describe('#form', () => {
    const listTests = url => () => {
      const params = url.match(AddAText.pathToBind).splice(1, 2);
      const items = ['foo', 'bar'];
      const res = {};
      const req = {
        url, params, journey: {},
        session: { AddAText: { items } },
        body: { items }
      };

      it('returns a form with an items field', () => {
        const addAnother = new AddAText(req, res);
        expect(addAnother.form.fields).has.property('items');
      });

      it('retrieves a list of items from the session', () => {
        const addAnother = new AddAText(req, res);
        addAnother.retrieve();
        expect(addAnother.fields).has.property('items');
        expect(addAnother.fields.items.value).to.eql(items);
      });

      it('parses a list of items from the body', () => {
        const addAnother = new AddAText(req, res);
        addAnother.parse();
        expect(addAnother.fields).has.property('items');
        expect(addAnother.fields.items.value).to.eql(items);
      });
    };

    describe('list mode', listTests('/add-a-text'));
    describe('delete mode', listTests('/add-a-text/item-0/delete'));

    describe('edit mode', () => {
      const url = '/add-a-text/item-0';
      const params = url.match(AddAText.pathToBind).splice(1, 2);
      const items = ['foo', 'bar'];
      const res = {};
      const req = {
        url, params, journey: {},
        session: { AddAText: { items } },
        body: { item: 'baz' }
      };

      it('returns a form with an item field', () => {
        const addAnother = new AddAText(req, res);
        expect(addAnother.form.fields).has.property('item');
      });

      it('parses a single item', () => {
        const addAnother = new AddAText(req, res);
        addAnother.parse();
        expect(addAnother.fields.item.value).to.eql('baz');
      });

      it('deserializes a single item from the items list', () => {
        const addAnother = new AddAText(req, res);
        addAnother.retrieve();
        expect(addAnother.fields.item.value).to.eql('foo');
      });
    });
  });

  describe('List mode', () => {
    describe('GET', () => {
      it('retrieves the list from the session', () => {
        return testStep(AddAText)
          .withSession({ AddAText: { items: ['foo', 'bar'] } })
          .get()
          .expect(OK)
          .html($ => {
            expect($('#item-0 .value')).contains.$text('foo');
            expect($('#item-1 .value')).contains.$text('bar');
          });
      });

      it('validates the list using the provided #validateList', () => {
        const ValidateAList = class ValidateAList extends AddAText {
          validateList(list) {
            return list.check('min 2', value => value.length >= 2);
          }
        };
        return testStep(ValidateAList)
          .withSession({ ValidateAList: { items: ['foo'] } })
          .get()
          .expect(OK)
          .html($ => {
            expect($('#errors')).contains.$text('min 2');
          });
      });

      it('validates each item in the list', () => {
        const ValidateAText = class ValidateAText extends AddAText {
          get field() {
            return text.check('no foos', value => value !== 'foo');
          }
        };
        return testStep(ValidateAText)
          .withSession({ ValidateAText: { items: ['foo', 'bar'] } })
          .get()
          .expect(OK)
          .html($ => {
            expect($('#item-0 .valid')).contains.$text('false');
            expect($('#item-0 .errors')).contains.$text('no foos');
            expect($('#item-1 .valid')).contains.$text('true');
          });
      });

      it('wont validate the list if no list was retrieved', () => {
        return testStep(AddAText)
          .withSession({})
          .get()
          .expect(OK)
          .html($ => {
            expect($('#form-filled')).contains.$text('false');
            expect($('#form-validated')).contains.$text('false');
          });
      });
    });

    describe('POST', () => {
      it('renders the template if not valid', () => {
        const ValidateAList = class ValidateAList extends AddAText {
          validateList(list) {
            return list.check('min 2', value => value.length >= 2);
          }
        };
        return testStep(ValidateAList)
          .withSession({ ValidateAList: { items: ['foo'] } })
          .post()
          .expect(OK)
          .html($ => {
            expect($('#errors')).contains.$text('min 2');
          });
      });

      it('redirects to #next if valid', () => {
        return testStep(AddAText)
          .withSession({ AddAText: { items: ['foo'] } })
          .post()
          .expect(MOVED_TEMPORARILY)
          .expect('location', '/next-step');
      });
    });

    ['put', 'patch', 'delete'].forEach(method => {
      describe(method.toUpperCase(), () => {
        it('returns 405 method not allowed', () => {
          return testStep(AddAText)
            .withSession({})
            .execute(method)
            .expect(METHOD_NOT_ALLOWED);
        });
      });
    });
  });

  describe('Edit mode', () => {
    describe('GET', () => {
      it('retrieves the specific item from the session', () => {
        return testStep(AddAText)
          .withSession({ AddAText: { items: ['foo', 'bar'] } })
          .get('/add-a-text/item-0')
          .expect(OK)
          .html($ => {
            return expect($('#item .value')).contains.$text('foo');
          });
      });

      {
        const ValidateAText = class ValidateAText extends AddAText {
          get field() {
            return text.check('always fails', () => false);
          }
        };
        const request = testStep(ValidateAText)
          .withSession({ ValidateAText: { items: ['foo'] } });

        it('validates the item', () => {
          return request
            .get('/validate-a-text/item-0')
            .expect(OK)
            .html($ => {
              expect($('#item .validated')).contains.$text('true');
              expect($('#item .valid')).contains.$text('false');
            });
        });

        it('wont validate the item if no item was retrieved', () => {
          return request
            .get('/validate-a-text/item-1')
            .expect(OK)
            .html($ => {
              expect($('#item .value')).contains.$text('no value');
              expect($('#item .validated')).$text('false');
            });
        });
      }
    });

    describe('POST', () => {
      const items = ['bar', 'baz'];
      const request = testStep(AddAText)
        .withField('item', 'foo')
        .withSession({ AddAText: { items } });

      it('adds the item to the list if the index is out of bounds', () => {
        return request
          .post('/add-a-text/item-2')
          .session(session => {
            expect(session.AddAText.items).to.eql([...items, 'foo']);
          });
      });

      it('updates the item if the index is inside the list bounds', () => {
        return request
          .post('/add-a-text/item-0')
          .session(session => {
            expect(session.AddAText.items).to.eql(['foo', 'baz']);
          });
      });

      it('sends json with empty validation when field is valid and request is an ajax', () => {
        const validationErrors = { validationErrors: [] };
        return testStep(AddAText)
          .withSetup(req => {
            req.headers['X-Requested-With'] = 'XMLHttpRequest';
          })
          .withField('item', 'foo')
          .withSession({})
          .post('/add-a-text/item-0')
          .expect(OK)
          .text(json => {
            return expect(json).to.equal(JSON.stringify(validationErrors));
          });
      });

      it('renders the template if not valid and request is not an ajax', () => {
        const ValidateAText = class ValidateAText extends AddAText {
          get field() {
            return text.check('always fails', () => false);
          }
        };
        return testStep(ValidateAText)
          .withField('item', 'foo')
          .withSession({})
          .post('/validate-a-text/item-0')
          .expect(OK)
          .html($ => {
            return expect($('#errors')).contains.$text('item: always fails');
          });
      });

      it('sends json with the validation errors if field not valid and request is an ajax', () => {
        const ValidateAText = class ValidateAText extends AddAText {
          get field() {
            return text.check('always fails', () => false);
          }
        };
        const validationErrors = {
          validationErrors: {
            field: 'item',
            errors: ['always fails'],
            value: 'foo'
          }
        };
        return testStep(ValidateAText)
          .withSetup(req => {
            req.headers['X-Requested-With'] = 'XMLHttpRequest';
          })
          .withField('item', 'foo')
          .withSession({})
          .post('/validate-a-text/item-0')
          .expect(UNPROCESSABLE_ENTITY)
          .text(json => {
            return expect(json).to.equal(JSON.stringify(validationErrors));
          });
      });

      it('sends json with the validation errors if object field not valid and request is an ajax', () => {
        const ValidateAText = class ValidateAText extends AddAText {
          get field() {
            return object({ a: text }).check(errorFor('a', 'always fails'), () => false);
          }
        };
        const validationErrors = {
          validationErrors: [
            {
              field: 'a',
              errors: ['always fails'],
              value: 'foo'
            }
          ]
        };
        return testStep(ValidateAText)
          .withSetup(req => {
            req.headers['X-Requested-With'] = 'XMLHttpRequest';
          })
          .withField('item.a', 'foo')
          .withSession({})
          .post('/validate-a-text/item-0')
          .expect(UNPROCESSABLE_ENTITY)
          .text(json => {
            return expect(json).to.equal(JSON.stringify(validationErrors));
          });
      });
    });

    ['put', 'patch', 'delete'].forEach(method => {
      describe(method.toUpperCase(), () => {
        it('redirects to list mode', () => {
          return testStep(AddAText)
            .withSession({})
            .execute(method, '/add-a-text/item-0')
            .expect(MOVED_TEMPORARILY)
            .expect('location', '/add-a-text');
        });
      });
    });
  });

  describe('Delete mode', () => {
    describe('GET', () => {
      it('deletes the given index from the list', () => {
        return testStep(AddAText)
          .withSession({ AddAText: { items: ['will delete', 'persists'] } })
          .get('/add-a-text/item-0/delete')
          .session(session => {
            expect(session.AddAText.items).to.not.contain('will delete');
          });
      });

      it('removes the list if the last item is being deleted', () => {
        return testStep(AddAText)
          .withSession({ AddAText: { items: ['will delete'] } })
          .get('/add-a-text/item-0/delete')
          .session(session => {
            expect(session.AddAText).to.not.have.property('items');
          });
      });

      it('redirects to list mode', () => {
        return testStep(AddAText)
          .withSession({ AddAText: { items: ['will delete'] } })
          .get('/add-a-text/item-0/delete')
          .expect(MOVED_TEMPORARILY)
          .expect('Location', '/add-a-text');
      });

      it("doesn't modify the list if the index is out of bounds", () => {
        const items = ['foo', 'bar'];
        return testStep(AddAText)
          .withSession({ AddAText: { items } })
          .get('/add-a-text/item-10/delete')
          .session(session => {
            expect(session.AddAText.items).to.eql(items);
          });
      });
    });

    describe('POST', () => {
      const items = ['1', '2', '3'];
      const request = testStep(AddAText)
        .withSession({ AddAText: { items } })
        .post('/add-a-text/item-1/delete');

      it('redirects to list mode', () => {
        return request
          .expect('Location', '/add-a-text')
          .expect(MOVED_TEMPORARILY);
      });

      it("doesn't modify the list", () => {
        return request
          .session(session => {
            expect(session.AddAText.items).to.eql(items);
          });
      });
    });

    ['put', 'patch', 'delete'].forEach(method => {
      describe(method.toUpperCase(), () => {
        it('redirects to list mode', () => {
          return testStep(AddAText)
            .withSession({})
            .execute(method, '/add-a-text/item-0/delete')
            .expect(MOVED_TEMPORARILY)
            .expect('location', '/add-a-text');
        });
      });
    });
  });

  describe('errors during request', () => {
    describe('mode not recognised', () => {
      const req = { journey: {} };
      const res = {};

      it('throws an error', () => {
        const addAText = new AddAText(req, res);
        sinon.stub(addAText, 'mode').get(() => 'blah');
        const willThrow = () => addAText.handler(req, res);
        expect(willThrow).throw(/mode: blah not recognised/);
      });
    });
  });
});
