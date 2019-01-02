/* eslint-disable no-invalid-this */
const sanitizer = require('sanitizer');
const traverse = require('traverse');

const sanitizeRequestBody = (req, res, next) => {
  traverse(req.body).forEach(function sanitizeValue(value) {
    if (this.isLeaf) {
      this.update(sanitizer.sanitize(value));
    }
  });
  next();
};

module.exports = sanitizeRequestBody;
