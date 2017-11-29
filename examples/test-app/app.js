const config = require('config');
const express = require('express');
const path = require('path');
const { journey } = require('@hmcts/one-per-page');
const lookAndFeel = require('@hmcts/look-and-feel');
const Sessions = require('./steps/admin/Session.step');
const Start = require('./steps/Start.step');
const Name = require('./steps/Name.step');
const Country = require('./steps/Country.step');
const CheckYourAnswers = require('./steps/CheckYourAnswers.step');
const Contact = require('./steps/Contact.step');
const Entry = require('./steps/Entry.step');
const RespondentTitle = require('./steps/respondent/RespondentTitle.step');
const ExitNorthernIreland = require('./steps/exits/ExitNorthernIreland.step');
const Exit = require('./steps/exits/Done.step');

const app = express();

const baseUrl = `http://localhost:${config.port}`;

lookAndFeel.configure(app, {
  baseUrl,
  express: { views: [path.resolve(__dirname, 'steps')] },
  webpack: {
    entry: [
      path.resolve(__dirname, 'assets/js/main.js'),
      path.resolve(__dirname, 'assets/scss/main.scss')
    ]
  },
  nunjucks: {
    globals: {
      phase: 'ALPHA',
      feedbackLink: 'https://github.com/hmcts/one-per-page/issues/new'
    }
  }
});

journey(app, {
  baseUrl,
  steps: [
    Start,
    Entry,
    RespondentTitle,
    Sessions,
    Name,
    Country,
    Contact,
    CheckYourAnswers,
    ExitNorthernIreland,
    Exit
  ],
  session: {
    redis: { url: config.redisUrl },
    cookie: { secure: false }
  }
});

app.listen(config.port);
