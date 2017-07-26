const CONF = require('config');
const session = require('express-session');
const secret = process.env.SECRET || CONF.secret;

module.exports = {

    test: () => {
        return session({
            secret: secret,
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: false
            }
        });
    }
};