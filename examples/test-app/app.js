const config = require('config');
const express = require('express');
const path = require('path');
const { journey } = require('@hmcts/one-per-page');
const lookAndFeel = require('@hmcts/look-and-feel');
const HelloWorld = require('./steps/HelloWorld');
const CreateSession = require('./steps/CreateSession');
const Sessions = require('./steps/Sessions');

const app = express();

lookAndFeel.configure(app, {
  baseUrl: `http://localhost:${config.port}`,
  express: { views: [path.resolve(__dirname, 'views')] },
  webpack: { entry: [path.resolve(__dirname, 'assets/scss/main.scss')] }
});

journey(app, {
  steps: [
    new HelloWorld(),
    new CreateSession(),
    new Sessions()
  ]
});

app.listen(config.port);
