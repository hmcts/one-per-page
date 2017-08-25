const config = require('config');
const express = require('express');
const path = require('path');
const { journey } = require('@hmcts/one-per-page');
const lookAndFeel = require('@hmcts/look-and-feel');
const HelloWorld = require('./steps/HelloWorld');
const CreateSession = require('./steps/CreateSession');
const Sessions = require('./steps/Sessions');
const Name = require('./steps/Name');

const app = express();

const baseUrl = `http://localhost:${config.port}`;

lookAndFeel.configure(app, {
  baseUrl,
  express: { views: [path.resolve(__dirname, 'views')] },
  webpack: { entry: [path.resolve(__dirname, 'assets/scss/main.scss')] }
});

journey(app, {
  baseUrl,
  steps: [
    new HelloWorld(),
    new CreateSession(),
    new Sessions(),
    new Name()
  ],
  session: {
    redis: { url: config.redisUrl },
    cookie: { secure: false }
  }
});

app.listen(config.port);
