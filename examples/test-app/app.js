const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
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
const Done = require('./steps/exits/Done.step');
const Error = require('./steps/exits/Error.step');
const SendToAPI = require('./steps/SendToAPI.step');

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
    SendToAPI,
    Done,
    Error
  ],
  session: {
    redis: { url: config.redisUrl },
    cookie: { secure: false }
  },
  apiUrl: `${baseUrl}/api/submit`
});

app.post('/api/submit', bodyParser.json(), (req, res) => {
  const response = { status: 'bad', originalBody: req.body };
  res.json(response);
});

app.listen(config.port);
