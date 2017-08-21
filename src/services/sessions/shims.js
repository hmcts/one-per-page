const activeProperty = Symbol('active');

const defineNotEnumerable = (target, property, value) => {
  Object.defineProperty(target, property, {
    enumerable: false,
    value,
    writable: true
  });
};

const generate = req => () => {
  if (req.session && typeof req.session.id === 'string') {
    req.session.destroy();
  }
  req.sessionStore.generate(req);
  defineNotEnumerable(req.session, activeProperty, true);
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

  return (sessionId, onLoad) => {
    return _get.call(req.sessionStore, sessionId, onLoad);
  };
};

const createSession = req => {
  const _createSession = req.sessionStore.createSession;

  return (request, sessionDataPlusMetadata) => {
    const { metadata, ...sessionData } = sessionDataPlusMetadata;
    const session = _createSession.call(request.sessionStore, request, sessionData);
    defineNotEnumerable(session, activeProperty, metadata.active);
    return session;
  };
};

module.exports = { generate, active, get, set, createSession };
