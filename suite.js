/**
 * @module http-test/suite
 */

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var EventEmitter = require('eventemitter2').EventEmitter2;
var inherit = require('util').inherits;
var merge = require('lodash.merge');
var defaults = require('lodash.defaultsdeep');
var isString = require('lodash.isstring');
var Test = require('./test');

/**
 * Creates a new suite.
 *
 * @param {object} options
 */
function Suite(options) {
  options = options || {};

  Test.call(this, arguments);

  this.name = options.name || null;
  this.description = options.description || null;
  this._ee = new EventEmitter();

  this.tests = [];
}

inherit(Suite, Test);

/**
 * Adds a listener to the end of the listeners array for the specified event.
 *
 * @param  {string}   name
 * @param  {function} callback
 * @return {Suite}
 */
Suite.prototype.on = function on(name, callback) {
  this._ee.on(name, callback);
  return this;
};

/**
 * An abstract method which accepts suites, tests and urls.
 *
 * @param {mixed} item
 * @return {Suite}
 */
Suite.prototype.add = function add(item) {
  if (isString(item)) {
    item = new Test({ request: { url: item } });
  }

  if (!(item instanceof Test)) {
    item = new Test(item);
  }

  this.tests.push(item);
  return this;
};

/**
 * Flattens the current suite. Returns an array of object containing the test and
 * suite options and the req object.
 *
 * @return {array}
 */
Suite.prototype.flatten = function flatten() {
  var self = this;
  var captured = [];

  this.tests.forEach(function(test) {
    var options = merge({}, self.options.request, test.options.request, { time: true });

    captured.push({
      test: test.options,
      req: options
    });
  });

  return captured;
};

Suite.prototype.run = function run() {
  var self = this;

  return Promise
    .map(this.flatten(), function runRequest(spec) {
      self.emit('request', spec.req);

      spec.res = request(spec.req)
        .then(function onResponse(res) {
          self.emit('response', res);
          return res;
        })
        .catch(function onError(err) {
          return Promise.resolve(err);
        })
      ;

      return Promise.props(spec);
    })
    .then(function eachResult(result) {
      return Promise.map(result, function(item) {
        if (item.res instanceof Error) {
          return { status: Test.FAILED, extra: { error: item.res }, flags: ['error'] };
        }

        console.log(self.options.name, item.res.statusCode);
      });
    })
    .catch(function broadcastError(err) {
      self.emit('error', err);
      return err;
    })
  ;
};

module.exports = Suite;
