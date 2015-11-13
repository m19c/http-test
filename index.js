/**
 * @module http-test
 */

var Base = require('./base');
var Suite = require('./suite');
var Test = require('./test');

module.exports = function createSuite(options) {
  return new Suite(options);
};

module.exports.Base = Base;
module.exports.Test = Test;
module.exports.Suite = Suite;

module.exports.PASSED = Base.PASSED;
module.exports.FAILED = Base.FAILED;
module.exports.INVALID = Base.INVALID;

module.exports.test = function createTest(options) {
  return new Test(options);
};
