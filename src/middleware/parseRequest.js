const parseRequest = (req, res, next) => {
  req.fields = req.fields || {};
  res.locals = res.locals || {};
  res.locals.fields = req.fields;

  if (typeof req.currentStep.form === 'undefined') {
    next();
    return;
  }

  console.log(req.body);

  const form = req.currentStep.form;

  if (req.method === 'POST') {
    form.parse(req);
    res.locals.invalidFields = form.invalidFields;
  } else if (req.method === 'GET') {
    form.retrieve(req);
  }

  // set accessors for fields
  req.fields = form.getFields;
  res.locals.fields = form.getFields;

  // set current step fields
  req.currentStep.fields = form;

  next();
};

module.exports = parseRequest;
