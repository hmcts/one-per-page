const i18Next = require('i18next');
const { defined } = require('../util/checks');

const i18NextInstance = i18Next.init({ fallbackLng: 'en' });

const i18nMiddleware = (req, res, next) => {
  if (defined(req.i18Next)) {
    next();
    return;
  }

  req.i18Next = i18NextInstance;

  next();
};

module.exports = { i18NextInstance, i18nMiddleware };
