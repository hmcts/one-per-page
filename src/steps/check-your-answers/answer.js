const { defined } = require('../../util/checks');
const { Reference } = require('../../forms/ref');
const { section } = require('./section');
const path = require('path');
const { fallback } = require('../../util/promises');
const { fileExists } = require('../../util/fs');

const resolveTemplate = (name, directories) => {
  const templatePaths = directories.map(dir => path.join(dir, name));
  return fallback(templatePaths.map(fileExists));
};

const renderAnswer = (answer, app) => new Promise((resolve, reject) => {
  if (typeof answer.template === 'string') {
    const directories = [
      answer.step.dirname,
      ...app.get('views')
    ];
    resolveTemplate(answer.template, directories).then(
      resolvedPath => {
        app.render(resolvedPath, answer.step.locals, (error, html) => {
          if (error) {
            reject(error);
          } else {
            answer.html = html;
            resolve(answer);
          }
        });
      },
      () => reject(new Error(`Failed to locate ${answer.template}`))
    );
  } else {
    resolve(answer);
  }
});

const getAnswer = (step, { answer }) => {
  if (defined(answer)) {
    return answer;
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

const getHide = ({ hide = false }) => hide;

// template: false indicates that no template should be rendered.
const getTemplate = ({
  template = false,
  answer = false,
  question = false
}) => {
  if ((answer && template) || (question && template)) {
    throw new Error('Provide answer and question or template, not both');
  }
  return template;
};

const answer = (step, args = {}) => {
  return {
    id: getId(step, args),
    section: getSection(args),
    question: getQuestion(step, args),
    answer: getAnswer(step, args),
    url: getUrl(step, args),
    complete: getComplete(step),
    hide: getHide(args),
    template: getTemplate(args),
    step
  };
};

module.exports = { answer, renderAnswer };
