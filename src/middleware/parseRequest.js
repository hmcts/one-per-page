const defineNotEnumberable = (obj, prop, value) => {
  Object.defineProperty(obj, prop, {
    enumerable: false,
    value,
    writable: true
  });
};

const parseRequest = (req, res, next) => {
  req.fields = req.fields || {};
  res.locals = res.locals || {};
  res.locals.fields = req.fields;
  req.currentStep.fields = req.fields;

  if (typeof req.currentStep.form === 'undefined') {
    next();
    return;
  }
  const form = req.currentStep.form;

  if (req.method === 'POST') {
    const parsedFields = form.parse(req);

    parsedFields.forEach(field => {
      req.fields[field.name] = field;
    });
  } else if (req.method === 'GET') {
    const retrievedFields = form.retrieve(req);

    retrievedFields.forEach(field => {
      req.fields[field.name] = field;
    });
  }

  defineNotEnumberable(req.fields, 'validate', () => form.validate(req.fields));
  defineNotEnumberable(req.fields, 'store', () => form.store(req));
  defineNotEnumberable(req.fields, 'errors', () => form.errors(req.fields));
  defineNotEnumberable(req.fields, 'valid', () => form.valid(req.fields));

  next();
};

module.exports = parseRequest;
