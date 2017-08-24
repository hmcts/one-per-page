const parseRequest = (req, res, next) => {
  req.fields = req.fields || {};

  const fieldsToParse = req.currentStep.fields || [];
  fieldsToParse.forEach(field => field.parse(req));

  next();
};

module.exports = parseRequest;
