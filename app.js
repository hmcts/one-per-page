const express = require('express');
const nunjucks = require('express-nunjucks');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const CONF = require('config');
const sessions = require('app/services/sessions');

app.set('port', process.env.PORT || CONF.port);
app.set('view engine', 'html');
app.set('views', [ __dirname + '/lib/', __dirname + '/app/views', __dirname + '/app/steps', __dirname + '/test/views']);

nunjucks(app,{
  autoescape: true,
  watch: true,
  noCache: false
}).env.addFilter('json', (obj)=> {
    return JSON.stringify(obj, null, 2);
});

app.use('/public', express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/govuk_modules/govuk_template/assets'));
app.use('/public', express.static(__dirname + '/govuk_modules/govuk_frontend_toolkit'));
app.use('/public/images/icons', express.static(__dirname + '/govuk_modules/govuk_frontend_toolkit/images'));
app.use(favicon(path.join(__dirname, 'govuk_modules', 'govuk_template', 'assets', 'images', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// one-per-page framework has a dependency on a session
app.set('trust proxy', 1);
app.use(sessions.test());

// TODO: app/steps/page/Page.js also brings this in.
const locals = require('app/middleware/locals');
app.use(locals);

// one-per-page framework
const initSteps = require('lib/opp/initSteps');
const errorHandler = require('lib/opp/core/errorHandler');
const requireDir = require('require-directory');
const middleware = requireDir(module,`${__dirname}/app/middleware`);
const stepDefinitions = requireDir(module,`${__dirname}/app/steps`);
app.use(middleware.commonContent);
const steps = initSteps(app, stepDefinitions);
app.use(errorHandler(steps));

module.exports = app;
