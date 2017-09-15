const applyContent = (req, res, next) => {
  res.locals = res.locals || {};

  // generate content from step using res.locals
  res.locals.content = req.currentStep.content;

  next();
};

module.exports = applyContent;
