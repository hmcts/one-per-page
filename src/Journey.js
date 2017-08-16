
const defaults = { steps: [] };

const journey = (app, { steps = defaults.steps } = defaults) => {
  steps.forEach(step => {
    app.use(step.router);
  });
  return app;
};

module.exports = journey;
