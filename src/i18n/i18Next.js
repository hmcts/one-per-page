const i18Next = require('i18next');
const { defined } = require('../util/checks');
const defaultIfUndefined = require('../util/defaultIfUndefined');

const i18NextInstance = i18Next.init({ fallbackLng: 'en' });

const i18nMiddleware = (req, res, next) => {
  if (!defined(req.i18Next)) {
    req.i18Next = i18NextInstance;
  }

  if (!defined(req.i18n)) {
    req.i18n = {
      t: i18NextInstance.t.bind(i18NextInstance),
      get availableLanguages() {
        const ns = req.currentStep.name;
        const allLangs = Object.keys(req.i18Next.services.resourceStore.data);

        return allLangs
          .filter(lang => ns in req.i18Next.services.resourceStore.data[lang])
          .map(lang => {
            return { code: lang, name: req.i18Next.t(lang) };
          });
      },
      get currentLanguage() {
        return defaultIfUndefined(req.i18Next.language, 'en');
      }
    };
  }

  if (defined(req.query) && defined(req.query.lng)) {
    req.i18Next.changeLanguage(req.query.lng);
  } else if (defined(req.cookies) && defined(req.cookies.i18n)) {
    req.i18Next.changeLanguage(req.cookies.i18n);
  } else {
    req.i18Next.changeLanguage('en');
  }

  res.cookie('i18n', defaultIfUndefined(req.i18Next.language, 'en'));

  next();
};

module.exports = { i18NextInstance, i18nMiddleware };
