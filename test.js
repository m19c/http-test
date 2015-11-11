/**
 * @module http-test/test
 */

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var isNumber = require('lodash.isnumber');
var defaults = require('lodash.defaultsdeep');
var merge = require('lodash.merge');
var isBoolean = require('lodash.isboolean');
var validate = require('./util/validate');

function Test(options, suite) {
  options = options || {};

  if (suite) {
    this.suite = suite;
  }

  this.req = defaults({}, options.req || {});
  this.spec = defaults({
    thresholds: []
  }, options.spec);
}

Test.PASSED = 'passed';
Test.FAILED = 'failed';
Test.INVALID = 'invalid';

Test.prototype.threshold = function threshold(ms, mark, flags) {
  if (!isNumber(ms)) {
    throw new Error('Argument one passed to `threshold` must be a number');
  }

  if (isBoolean(mark)) {
    mark = (mark) ? Test.PASSED : Test.FAILED;
  }

  this.spec.thresholds.push({
    threshold: ms,
    mark: mark,
    flags: flags || []
  });

  return this;
};

Test.prototype.run = function run() {
  var test = this;

  var current = {
    spec: merge({}, test.spec || {}, test.suite.spec || {}),
    err: null,
    req: merge({}, test.req || {}, test.suite.req || {}, { time: true }),
    res: null
  };

  test.suite.emit('request', test.req);

  return request(current.req)
    .then(function handleRes(res) {
      current.res = res;
      test.suite.emit('response', current);

      return Promise.resolve(current);
    })
    .catch(function handleErr(err) {
      current.err = err;
      return Promise.resolve(current);
    })
    .then(function runValidator(item) {
      item = {
        test: item,
        status: validate(item)
      };

      test.suite.emit('test', item);

      return item;
    })
  ;
};

module.exports = Test;
