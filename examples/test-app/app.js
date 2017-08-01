const express = require('express');
const nunjucks = require('express-nunjucks');
const {Journey} = require('@hmcts/one-per-page');
const HelloWorld = require('./steps/HelloWorld');

const app = express();

const helloworldJourney = Journey({
  steps: [new HelloWorld()]
});
app.use(helloworldJourney);

app.set('views', ['views']);
nunjucks(app);

app.listen(3000);
