const packageJson = require('package.json');

module.exports = (req, res, next) => {
    res.locals.asset_path = '/public/';
    res.locals.session = req.session;
    res.locals.releaseVersion = 'v' + packageJson.version;

    next();
};