const i18Next = require('i18next');

const i18NextInstance = i18Next.init();
i18NextInstance.changeLanguage('en');

module.exports = i18NextInstance;
