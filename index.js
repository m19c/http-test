var Suite = require('./suite');

module.exports = function httpTest(options) {
  return new Suite(options);
};
