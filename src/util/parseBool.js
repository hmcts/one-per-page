const truthies = ['true', 'True', 'TRUE', '1', 'yes', 'Yes', 'YES', 'y', 'Y'];

const parseBool = (bool = '') => {
    if (truthies.includes(bool)) {
        return true;
    }
    return false;
}

module.exports = {
    parseBool
};
  