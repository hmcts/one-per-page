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


const _set = Symbol('set');
const set = req => {
  if (req.sessionStore[_set]) return req.sessionStore.set;

  req.sessionStore[_set] = req.sessionStore.set;
  return (sessionId, session, onSet) => {
    const metadata = { active: session[activeProperty] };
    const modified = Object.assign({}, session, { metadata });

    return req.sessionStore[_set](sessionId, modified, onSet);
  };
};

const _get = Symbol('get');
const get = req => {
  if (req.sessionStore[_get]) return req.sessionStore.get;

  req.sessionStore[_get] = req.sessionStore.get;
  return (sessionId, onLoad) => req.sessionStore[_get](sessionId, onLoad);
};

const _create = Symbol('createSession');
const createSession = req => {
  if (req.sessionStore[_create]) return req.sessionStore.createSession;

  req.sessionStore[_create] = req.sessionStore.createSession;
  return (request, json) => {
    const { metadata } = json;
    const sessionData = Object.assign({}, json);
    delete sessionData.metadata;
    request.sessionStore[_create](request, sessionData);

    return shimSession(request, metadata);
  };
};

module.exports = { get, set, createSession, shimSession };
