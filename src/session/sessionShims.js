const activeProperty = Symbol('active');
const setActive = (session, value) => {
  Object.defineProperty(session, activeProperty, {
    enumerable: false,
    value: value || session[activeProperty],
    writable: true
  });
};

const active = req => () => req.session && req.session[activeProperty];

const shimSession = (req, { active: isActive = false } = {}) => {
  setActive(req.session, isActive);
  req.session.active = active(req);
  /* eslint-disable no-use-before-define */
  req.session.generate = generate(req);
  /* eslint-enable */
  return req.session;
};

const generate = req => () => {
  if (req.session && typeof req.session.id === 'string') {
    req.session.destroy();
  }
  req.sessionStore.generate(req);
  return shimSession(req, { active: true });
};

module.exports = { activeProperty, shimSession };
