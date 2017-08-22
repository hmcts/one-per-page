const defineNotEnumerable = (target, property, value) => {
  Object.defineProperty(target, property, {
    enumerable: false,
    value,
    writable: true
  });
};

const activeProperty = Symbol('active');
const wrapSession = (session, { active = false } = {}) => {
  defineNotEnumerable(session, activeProperty, active);
  return session;
};

const generate = req => () => {
  if (req.session && typeof req.session.id === 'string') {
    req.session.destroy();
  }
  req.sessionStore.generate(req);
  return wrapSession(req.session, { active: true });
};

const active = req => () => req.session && req.session[activeProperty];

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
    const session = request.sessionStore[_create](request, sessionData);

    return wrapSession(session, metadata);
  };
};

module.exports = { generate, active, get, set, createSession };
