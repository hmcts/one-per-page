const parseRequest = (req, res, next) => {
  req.fields = req.fields || {};
  res.locals = res.locals || {};

  if (typeof req.currentStep.fields === 'undefined') {
    next();
    return;
  }

  if (req.method === 'POST') {
    req.currentStep.fields.parse(req);
    req.currentStep.fields.validate();
  } else if (req.method === 'GET') {
    req.currentStep.fields.retrieve(req);
  }

  // set accessors for fields
  req.fields = req.currentStep.fields;
  res.locals.fields = req.currentStep.fields;

  next();
};

module.exports = parseRequest;
