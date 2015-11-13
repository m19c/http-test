/**
 * @module http-test/test
 */

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var inherit = require('util').inherits;
var merge = require('lodash.merge');
var validate = require('./util/validate');
var Base = require('./base');

function Test(options, suite) {
  Test.super_.apply(this, [options]);

  if (suite) {
    this.suite = suite;
  }
}

inherit(Test, Base);

Test.PASSED = Base.PASSED;
Test.FAILED = Base.FAILED;
Test.INVALID = Base.INVALID;

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
      test.suite.emit('error', err);

      return Promise.resolve(current);
    })
    .then(function runValidator(item) {
      item.status = validate(item);
      test.suite.emit('test', item);
      test.suite.emit('broadcast.test', item);

      return item;
    })
  ;
};

module.exports = Test;
