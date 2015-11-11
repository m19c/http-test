/**
 * @module http-test/suite
 */

var Promise = require('bluebird');
var EventEmitter = require('eventemitter2').EventEmitter2;
var inherit = require('util').inherits;
var isString = require('lodash.isstring');
var Test = require('./test');

/**
 * Creates a new suite.
 *
 * @param {object} options
 */
function Suite(options) {
  options = options || {};

  Suite.super_.apply(this, arguments);
  this._ee = new EventEmitter();

  this.name = options.name || null;
  this.description = options.description || null;

  this.stack = [];
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

Suite.prototype.emit = function emit(name, args) {
  this._ee.emit(name, args);
  return this;
};

/**
 * An abstract method which accepts suites, tests and urls (strings).
 *
 * @param {mixed} item
 * @return {Suite}
 */
Suite.prototype.add = function add(item) {
  if (isString(item)) {
    item = new Test({ req: { url: item } }, this);
  }

  if (!(item instanceof Test) && !(item instanceof Suite)) {
    item = new Test(item);
  }

  item.suite = this;
  this.stack.push(item);
  return this;
};

Suite.prototype.run = function run() {
  var suite = this;

  return Promise
    .map(this.stack, function each(item) {
      return item.run();
    })
    .then(function summarize(result) {
      return {
        suite: {
          name: suite.name,
          description: suite.description
        },
        tests: result.map(function mapResult(item) {
          if (item.suite) {
            return item;
          }

          return {
            req: item.test.req,
            status: item.status
          };
        })
      };
    })
  ;
};

module.exports = Suite;
