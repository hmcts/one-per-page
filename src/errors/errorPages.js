// const { Page } = require('@hmcts/one-per-page');
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require('http-status-codes');

const defaulTemplate = 'look-and-feel/layouts/error.html';

class ErrorPages {

  constructor() {}

  /** bind 404 and 500's to the app */
  static bind(app, userOpts) {
    const opts = userOpts || {};
    const defaultAssets = `<link href="'+ req.app.locals.asset_path +'main.css" 
        media="screen" rel="stylesheet" />`;

    app.use((errors, req, res) => {
      const serverError = opts.serverError || {};
      res.status(INTERNAL_SERVER_ERROR).render(
        serverError.template || defaulTemplate,
        {
          title: serverError.title || 'Sorry, we\'re having technical problems',
          message: serverError.message || 'Please try again in a few minutes.',
          error: errors,
          assets: serverError.assets || defaultAssets
        }
      );
    });

    app.use((req, res) => {
      const notFound = opts.notFound || {};

      if (typeof notFound.nextSteps !== 'undefined'
          && !notFound.nextSteps.isArray()) {
        throw new TypeError('nextSteps is expected to be an array');
      }

      res.status(NOT_FOUND).render(
        notFound.template || defaulTemplate,
        {
          title: notFound.title || 'Page not found',
          message: notFound.message || `This could be because you've followed a 
            broken or outdated link, or there's an error on our site.`,
          nextSteps: notFound.nextSteps || [
            'go to the previous page',
            '<a href="/">go home</a>'
          ],
          assets: notFound.assets || defaultAssets
        }
      );
    });
  }
}

module.exports = ErrorPages;
