const {Router} = require('express');

const defaults = {
  steps: [],
  views: ['app/views/']
};

const Journey = ({
  steps = defaults.steps
} = defaults) => {
  const router = Router();

  steps.forEach(step => {
    router.use(step.router);
  });

  return router;
};

module.exports = Journey;
