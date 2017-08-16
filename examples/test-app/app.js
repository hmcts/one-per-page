const config = require('config');
const express = require('express');
const path = require('path');
const { journey } = require('@hmcts/one-per-page');
const lookAndFeel = require('@hmcts/look-and-feel');
const HelloWorld = require('./steps/HelloWorld');

const app = express();

lookAndFeel.configure(app, {
  baseUrl: `http://localhost:${config.port}`,
  express: { views: [path.resolve(__dirname, 'views')] },
  webpack: { entry: [path.resolve(__dirname, 'assets/scss/main.scss')] }
});

journey(app, { steps: [new HelloWorld()] });

app.listen(config.port);
