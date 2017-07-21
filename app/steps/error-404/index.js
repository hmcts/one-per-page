const Page = require('app/steps/page/Page');

module.exports = class Error404 extends Page {
    get url() { return '/errors/404'; }
};