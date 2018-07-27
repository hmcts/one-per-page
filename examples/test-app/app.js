const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { BAD_REQUEST } = require('http-status-codes');
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
const Done = require('./steps/exits/Done.step');
const Error = require('./steps/exits/Error.step');
const ExitDate = require('./steps/exits/ExitDate.step');
const DateOfMarriage = require('./steps/DateOfMarriage.step');
const ExampleServerError = require('./steps/errors/ExampleServerError.step');
const DatesYouCantAttend = require('./steps/DatesYouCantAttend.step');
const InfoPage = require('./steps/InfoPage.step');

const app = express();

const baseUrl = `http://localhost:${config.port}`;

lookAndFeel.configure(app, {
  baseUrl,
  express: {
    views: [
      path.resolve(__dirname, 'steps'),
      path.resolve(__dirname, 'views')
    ]
  },
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
    Done,
    Error,
    ExampleServerError,
    ExitDate,
    DateOfMarriage,
    DatesYouCantAttend,
    InfoPage
  ],
  errorPages: {},
  session: {
    redis: { url: config.redisUrl },
    cookie: { secure: false }
  },
  apiUrl: `${baseUrl}/api/submit`
});

app.post('/api/submit', bodyParser.json(), (req, res) => {
  const petitionerLastName = req.body.petitioner.lastName.toLowerCase();
  const respondentLastName = req.body.respondent.lastName.toLowerCase();

  if (petitionerLastName === respondentLastName) {
    res.json({ status: 'ok', originalBody: req.body });
  } else {
    res.status(BAD_REQUEST);
    res.json({
      status: 'bad',
      originalBody: req.body,
      error: 'For the purpose of this demo, the last names must match'
    });
  }
});

app.listen(config.port);
