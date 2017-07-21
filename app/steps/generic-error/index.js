const Page = require('app/steps/page/Page');

module.exports = class GenericError extends Page {
    get url() { return '/generic-error'; }
};