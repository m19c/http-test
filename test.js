/**
 * @module http-test/test
 */

var isNumber = require('lodash.isnumber');
var defaults = require('lodash.defaultsdeep');

function Test(options) {
  options = options || {};

  this.request = defaults({}, options.request || {});
  this.spec = defaults({
    expectedStatusCode: null,
    shouldBeSuccessful: null,
    thresholds: [],
    validators: []
  }, options.test);
}

Test.PASSED = 'passed';
Test.FAILED = 'failed';

Test.prototype.expectStatusCode = function expectStatusCode(statusCode) {
  this.spec.expectedStatusCode = statusCode;
  return this;
};

Test.prototype.shouldBeSuccessful = function shouldBeSuccessful(flag) {
  this.spec.shouldBeSuccessful = flag || true;
  return this;
};

Test.prototype.threshold = function threshold(ms, mark, flags) {
  if (!isNumber(ms)) {
    throw new Error('Argument one passed to `threshold` must be a number');
  }

  this.spec.thresholds.push([ms, mark, flags || []]);
  return this;
};

module.exports = Test;
