const parseRequest = (req, res, next) => {
  req.fields = req.fields || {};
  res.locals = res.locals || {};
  res.locals.fields = req.fields;

  const fieldsToParse = req.currentStep.fields || [];
  fieldsToParse.forEach(field => {
    const parsedField = field.parse(req);
    req.fields[parsedField.name] = parsedField;
  });

  next();
};

module.exports = parseRequest;
