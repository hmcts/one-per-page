const { goTo, EntryPoint } = require('@hmcts/one-per-page');

class Entry extends EntryPoint {
  static get path() {
    return '/start';
  }

  next() {
    return goTo(this.journey.steps.DateOfMarriage);
  }
}

module.exports = Entry;
