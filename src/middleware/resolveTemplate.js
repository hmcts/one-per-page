const path = require('path');
const { fileExists } = require('../util/fs');
const { isDev } = require('../util/nodeEnv');
const { fallback } = require('../util/promises');
const { notDefined, defined } = require('../util/checks');

const viewTargets = (step, viewFolders) => {
  if (notDefined(step.name)) {
    return [];
  }
  return viewFolders
    .map(folder => [
      path.resolve(path.join(folder, `${step.name}.html`)),
      path.resolve(path.join(folder, `${step.name}.template.html`))
    ])
    .reduce((views, results) => [...results, ...views], []);
};

const stepTargets = step => {
  if (notDefined(step.dirname)) {
    return [];
  }
  const templatePath = path.join(step.dirname, 'template.html');
  if (notDefined(step.name)) {
    return [templatePath];
  }
  return [
    path.join(step.dirname, `${step.name}.html`),
    path.join(step.dirname, `${step.name}.template.html`),
    templatePath
  ];
};

const noTemplateErrorMessage = attempts => {
  const attemptLines = attempts.map(s => `   ${s}`);
  return [
    'No templates found',
    '',
    ...attemptLines
  ].join('\n');
};

const resolveTemplate = (req, res, next) => {
  const step = req.currentStep;

  if (defined(step.template) && !isDev) {
    next();
  } else if (notDefined(step.name) && notDefined(step.dirname)) {
    next(new Error('req.currentStep is not a Step'));
  } else {
    const templatePaths = [
      ...stepTargets(step),
      ...viewTargets(step, req.app.get('views'))
    ];

    const foundTemplate = fallback(templatePaths.map(fileExists));

    foundTemplate.then(
      filepath => {
        step.template = filepath;
        next();
      },
      () => next(noTemplateErrorMessage(templatePaths))
    );
  }
};

module.exports = resolveTemplate;
