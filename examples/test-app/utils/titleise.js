const titleise = string => {
  if (typeof string === 'undefined') {
    return '';
  }
  if (string.length < 1) {
    return string.toUpperCase();
  }
  const firstChar = string[0].toUpperCase();
  const rest = string.slice(1)
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase();

  return `${firstChar}${rest}`;
};

module.exports = titleise;
