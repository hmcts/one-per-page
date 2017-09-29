const formProxyHandler = require('../forms/formProxyHandler');

const parseRequest = (req, res, next) => {
  req.fields = req.fields || {};
  res.locals = res.locals || {};
  res.locals.fields = req.fields;

  const form = req.currentStep.form;
  if (typeof form === 'undefined') {
    next();
    return;
  }

  if (req.method === 'POST') {
    form.parse(req);
    res.locals.invalidFields = form.invalidFields;
  } else if (req.method === 'GET') {
    form.retrieve(req);
  }

  // set accessors for fields
  req.form = form;
  req.fields = new Proxy(form, formProxyHandler);
  res.locals.form = req.form;
  res.locals.fields = req.fields;
  req.currentStep.fields = req.fields;

  next();
};

module.exports = parseRequest;
