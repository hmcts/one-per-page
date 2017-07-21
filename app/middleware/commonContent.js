const i18next = require('i18next').createInstance();
const content = require('app/content/common');

i18next.init(content, (err) => {
    if (err) {
        process.emit('applicaton-log', {
            level: 'ERROR',
            message: 'application-i18n-common. Failed to initialise i18next',
            fields: {
                error: err.message
            }
        });
    }
});
i18next.changeLanguage('en');

function commonContentMiddleware(req, res, next) {

    const i18nProxy = new Proxy(i18next, {
        get: (target, key) => {
            if (target.exists(key)) {
                return target.t(key, {pageUrl: req.baseUrl});
            } else return '';
        }
    });

    req.i18n = i18next;
    res.locals.i18n = i18next;
    res.locals.common = i18nProxy;
    res.locals.content = i18nProxy;
    next();
}

module.exports = commonContentMiddleware;