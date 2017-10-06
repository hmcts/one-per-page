const { fileExists, readJson, glob } = require('../util/fs');
const { notDefined, defined } = require('../util/checks');

const langInFilepathRegex = /^.*\.(\w{2}(?:-\w{2})?)\.json$/;
const langRegex = /^\w{2}(?:-\w{2})?$/;

const keyParseError = (key, filepath) =>
  `top level key: ${key} in ${filepath} not a country code`;

const parseI18N = (filepath, contents) => {
  const match = filepath.match(langInFilepathRegex);

  if (defined(match) && defined(match[1])) {
    return [{ lang: match[1], translations: contents }];
  }

  return Object.keys(contents)
    .map(key => {
      if (defined(key.match(langRegex))) {
        return [{ lang: key, translations: contents[key] }];
      }
      throw new Error(keyParseError(key, filepath));
    })
    .reduce((acc, arr) => [...acc, ...arr], []);
};

const applyContent = (req, res, next) => {
  if (notDefined(req.currentStep)) {
    next('req.currentStep is not a Step');
    return;
  }
  if (notDefined(req.i18Next)) {
    next('i18Next not configured');
    return;
  }

  res.locals = res.locals || {};
  const step = req.currentStep;

  const addResourceBundles = filepath => contents => {
    const bundles = parseI18N(filepath, contents);
    bundles.forEach(({ lang, translations }) => {
      req.i18Next.addResourceBundle(
        lang,
        req.currentStep.name,
        translations
      );
    });
  };
  const loadContents = filepaths => {
    const loadPromises = filepaths.map(filepath =>
      fileExists(filepath)
        .then(readJson)
        .then(addResourceBundles(filepath))
    );
    return Promise.all(loadPromises);
  };

  const promises = [
    glob(`${step.dirname}/content.json`).then(loadContents),
    glob(`${step.dirname}/content.@(*).json`).then(loadContents),
    glob(`${step.dirname}/${step.name}.json`).then(loadContents)
  ];

  Promise.all(promises).then(
    () => {
      req.i18Next.setDefaultNamespace(step.name);
      next();
    },
    error => next(error)
  );
};

module.exports = applyContent;
