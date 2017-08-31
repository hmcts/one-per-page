const destroySession = (req, res, next) => {
    req.session.destroy();
    next();
};

module.exports = destroySession;
  