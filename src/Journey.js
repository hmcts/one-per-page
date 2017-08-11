const { Router: expressRouter } = require('express');

const defaults = {
  steps: [],
  views: ['app/views/']
};

const journey = ({ steps = defaults.steps } = defaults) => {
  const router = expressRouter();

  steps.forEach(step => {
    router.use(step.router);
  });

  return router;
};

module.exports = journey;
