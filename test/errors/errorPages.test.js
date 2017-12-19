const ErrorPages = require('../../src/errors/errorPages');
const { expect, sinon } = require('../util/chai');
const { supertest, testApp, wrapWithResponseAssertions } = require('../util/supertest');
const { journey } = require('../../src/flow');
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const Page = require('../../src/steps/Page');

describe('errors/errorPages', () => {
  const defaultOptions = {
    session: { secret: 'foo' },
    baseUrl: 'http://localhost'
  };
  const options = (...overrides) => {
    const foo = Object.assign(
      {},
      defaultOptions,
      ...overrides
    );
    return foo;
  };

  const customNotFound = {
    notFound: {
      template: 'errors/error.html',
      title: 'some not found title',
      message: 'some not found message',
      nextSteps: ['1', '2', 3]
    }
  };

  const customServerError = {
    serverError: {
      template: 'errors/error.html',
      title: 'some server error title',
      message: 'some server error meessage',
      error: 'some server error'
    }
  };

  describe('bind', () => {
    describe('404 Not found', () => {
      describe('default page', () => {
        const app = journey(testApp(), options());

        it('should contain default header', () => {
          return wrapWithResponseAssertions(supertest(app)
            .get('/some-random-page')).expect(NOT_FOUND)
            .html($ => {
              return expect($('body')).to.contain
                .$text('Page not found');
            });
        });

        it('should contain default body', () => {
          return wrapWithResponseAssertions(supertest(app)
            .get('/some-random-page')).expect(NOT_FOUND)
            .html($ => {
              return expect($('body')).to.contain
                .$text('could be because you\'ve followed a ' +
                  'broken or outdated link, or there\'s an error on our site.');
            });
        });

        describe('should contain default steps', () => {
          it('should include go to previous', () => {
            return wrapWithResponseAssertions(supertest(app)
              .get('/some-random-page')).expect(NOT_FOUND)
              .html($ => {
                return expect($('body')).to.contain
                  .$text('go to the previous page');
              });
          });

          it('should include go home', () => {
            return wrapWithResponseAssertions(supertest(app)
              .get('/some-random-page')).expect(NOT_FOUND)
              .html($ => {
                return expect($('body')).to.contain.$text('go home');
              });
          });
        });
      });

      describe('custom page', () => {
        const app = journey(testApp(), options({ errorPages: customNotFound }));

        it('should contain custom header', () => {
          return wrapWithResponseAssertions(supertest(app)
            .get('/some-random-page')).expect(NOT_FOUND)
            .html($ => {
              return expect($('body')).to.contain
                .$text(customNotFound.notFound.title);
            });
        });

        it('should contain custom body', () => {
          return wrapWithResponseAssertions(supertest(app)
            .get('/some-random-page')).expect(NOT_FOUND)
            .html($ => {
              return expect($('body')).to.contain
                .$text(customNotFound.notFound.message);
            });
        });

        it('should contain custom steps', () => {
          return wrapWithResponseAssertions(supertest(app)
            .get('/some-random-page')).expect(NOT_FOUND)
            .html($ => {
              return expect($('body')).to.contain
                .$text(customNotFound.notFound.nextSteps[2]);
            });
        });
      });

    });

    describe('500 Server error', () => {

      const failurePage = class extends Page {
        get name() {
          return 'TestPage';
        }
        handler(req, res) {
          throw 'an error occurred :(';
        }
      };

      describe('default page', () => {
        const app = journey(testApp(), options({ steps: [failurePage] }));
        it('should contain default header', () => {
          return wrapWithResponseAssertions(supertest(app)
            .get(failurePage.path))
            .expect(INTERNAL_SERVER_ERROR)
            .html($ => {
              return expect($('body')).to.contain
                .$text('Sorry, we\'re having technical problems');
            });
        });

        it('should contain default body', () => {
          return wrapWithResponseAssertions(supertest(app)
            .get(failurePage.path))
            .expect(INTERNAL_SERVER_ERROR)
            .html($ => {
              return expect($('body')).to.contain
                .$text('Sorry, we\'re having technical problems\n' +
                  'Please try again in a few minutes.');
            });
        });

        it('should show error message', () => {
          return wrapWithResponseAssertions(supertest(app)
            .get(failurePage.path))
            .expect(INTERNAL_SERVER_ERROR)
            .html($ => {
              return expect($('body')).to.not.contain
                .$text('an error occurred :(');
            });

        });
      });

      describe('custom page', () => {
        const app = journey(testApp(), options({
          steps: [failurePage], errorPages: customServerError }));

        it('should contain default header', () => {
          return wrapWithResponseAssertions(supertest(app)
            .get(failurePage.path))
            .expect(INTERNAL_SERVER_ERROR)
            .html($ => {
              return expect($('body')).to.contain
                .$text(customServerError.serverError.title);
            });
        });

        it('should contain default body', () => {
          return wrapWithResponseAssertions(supertest(app)
            .get(failurePage.path))
            .expect(INTERNAL_SERVER_ERROR)
            .html($ => {
              return expect($('body')).to.contain
                .$text(customServerError.serverError.message);
            });
        });

        it('should show error message', () => {
          return wrapWithResponseAssertions(supertest(app)
            .get(failurePage.path))
            .expect(INTERNAL_SERVER_ERROR)
            .html($ => {
              return expect($('body')).to.not.contain
                .$text('an error occurred :(');
            });

        });
      });

    });
  });
});