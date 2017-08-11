const config = require('config');
const express = require('express');
const nunjucks = require('express-nunjucks');
const { journey, patterns } = require('@hmcts/one-per-page');
const HelloWorld = require('./steps/HelloWorld');

const app = express();

const helloworldJourney = journey({ steps: [new HelloWorld()] });
app.use(helloworldJourney);

app.set('views', ['views', patterns()]);
nunjucks(app);

app.listen(config.port);
