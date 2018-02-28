const i18Next = require('i18next');
const { defined } = require('../util/checks');

const i18NextInstance = i18Next.init({ fallbackLng: 'en' });

const i18nMiddleware = (req, res, next) => {
  if (!defined(req.i18Next)) {
    req.i18Next = i18NextInstance;
  }

  if (!defined(req.availableLangs)) {
    req.availableLangs = () => {
      const ns = req.currentStep.name;
      const allLangs = Object.keys(req.i18Next.services.resourceStore.data);

      return allLangs
        .filter(lang => ns in req.i18Next.services.resourceStore.data[lang])
        .map(lang => {
          return { code: lang, name: req.i18Next.t(lang) };
        });
    };
  }

  next();
};

module.exports = { i18NextInstance, i18nMiddleware };
