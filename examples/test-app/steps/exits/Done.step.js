const { ExitPoint } = require('@hmcts/one-per-page');

class Done extends ExitPoint {
  static get path() {
    return '/done';
  }

  values() {
    console.log("child");
    return {
      something: "donkey",
      country: this.journey.answers.filter(s => s.id== "Country")[0].answer
    };
  }
}

module.exports = Done;
