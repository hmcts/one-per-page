const Page = require('app/steps/page/Page');

module.exports = class Error500 extends Page {
    get url() { return '/errors/500'; }
};