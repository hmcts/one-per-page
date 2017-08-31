const { goTo, EntryPoint } = require('@hmcts/one-per-page');

class Entry extends EntryPoint {
  get url() {
    return '/start';
  }

  next() {
    return goTo(this.journey.Country);
  }
}

module.exports = Entry;
