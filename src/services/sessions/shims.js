const defineNotEnumerable = (target, property, value) => {
  Object.defineProperty(target, property, {
    enumerable: false,
    value,
    writable: true
  });
};

const activeProperty = Symbol('active');
const wrapSession = (session, { active = true } = {}) => {
  defineNotEnumerable(session, activeProperty, active);
  return session;
};

const generate = req => () => {
  if (req.session && typeof req.session.id === 'string') {
    req.session.destroy();
  }
  req.sessionStore.generate(req);
  return wrapSession(req.session);
};

const active = req => () => req.session && req.session[activeProperty];

const set = req => {
  const _set = req.sessionStore.set;

  return (sessionId, session, onSet) => {
    const metadata = { active: session[activeProperty] };
    const modified = Object.assign({}, session, { metadata });

    return _set.call(req.sessionStore, sessionId, modified, onSet);
  };
};

const get = req => {
  const _get = req.sessionStore.get;

  return (sessionId, onLoad) => _get.call(req.sessionStore, sessionId, onLoad);
};

const createSession = req => {
  const _createSession = req.sessionStore.createSession;

  return (request, json) => {
    const { metadata } = json;
    const sessionData = Object.assign({}, json);
    delete sessionData.metadata;
    const session = _createSession.call(
      request.sessionStore,
      request,
      sessionData
    );
    return wrapSession(session, { active: metadata.active });
  };
};

module.exports = { generate, active, get, set, createSession };
