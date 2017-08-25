const addLocals = (req, res, next) => {
  res.locals = res.locals || {};
  res.locals.url = req.currentStep.url;
  next();
};

module.exports = addLocals;
