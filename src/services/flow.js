const goTo = step => {
  return {
    redirect(req, res) {
      res.redirect(step.url);
    }
  };
};

module.exports = { goTo };
