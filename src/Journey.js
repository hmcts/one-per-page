const sessions = require('./services/sessions');

const defaults = { steps: [] };

const journey = (app, { steps = defaults.steps } = defaults) => {
  app.use(sessions());
  steps.forEach(step => {
    app.use(step.router);
  });
  return app;
};

module.exports = journey;
