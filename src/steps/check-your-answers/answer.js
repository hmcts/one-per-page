const { defined } = require('../../util/checks');
const { Reference } = require('../../forms/ref');
const { section } = require('./section');

const getAnswer = (step, { value, answer }) => {
  if (defined(answer)) {
    return answer;
  }

  if (typeof value === 'string') {
    return value;
  } else if (typeof value === 'object') {
    return Object.values(value).join(' ');
  } else if (Array.isArray(value)) {
    return value.join(' ');
  }

  if (defined(step.fields)) {
    return Object.values(step.fields)
      .filter(field => !(field instanceof Reference))
      .map(field => field.value)
      .join(' ');
  }

  return '';
};

const titleise = string => {
  if (string.length < 1) {
    return string;
  }
  const firstChar = string[0].toUpperCase();
  const rest = string.slice(1)
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase();

  return `${firstChar}${rest}`;
};

const getQuestion = (step, { question }) => {
  if (defined(question)) {
    return question;
  }
  return defined(step.name) ? titleise(step.name) : 'No question defined';
};

const getSection = args => {
  if (defined(args.section)) {
    return args.section;
  }
  return section.default.id;
};

const getValue = (step, { value }) => {
  if (defined(value)) {
    return value;
  }
  if (defined(step.fields)) {
    return Object.values(step.fields)
      .filter(field => !(field instanceof Reference))
      .reduce((obj, field) => {
        Object.assign(obj, { [field.name]: field.value });
        return obj;
      }, {});
  }
  return undefined; // eslint-disable-line no-undefined
};

const getUrl = (step, { url }) => {
  if (defined(url)) {
    return url;
  }
  return step.path;
};

const getComplete = step => {
  if (defined(step.fields) && defined(step.fields.valid)) {
    return step.fields.valid;
  }
  return false;
};

const getId = (step, { id }) => {
  if (defined(id)) {
    return id;
  }
  if (defined(step) && defined(step.name)) {
    return step.name;
  }
  return 'no-id';
};

const answer = (step, args = {}) => {
  return {
    id: getId(step, args),
    section: getSection(args),
    question: getQuestion(step, args),
    answer: getAnswer(step, args),
    url: getUrl(step, args),
    value: getValue(step, args),
    complete: getComplete(step)
  };
};

module.exports = answer;
