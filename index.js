/**
 * @module http-test
 */

var Suite = require('./suite');
var Test = require('./test');

module.exports = function createSuite(options) {
  return new Suite(options);
};

module.exports.Test = Test;
module.exports.Suite = Suite;

module.exports.test = function createTest(options) {
  return new Test(options);
};
