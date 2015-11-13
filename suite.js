/**
 * @module http-test/suite
 */

var Promise = require('bluebird');
var EventEmitter = require('eventemitter2').EventEmitter2;
var inherit = require('util').inherits;
var isString = require('lodash.isstring');
var through2 = require('through2');
var Test = require('./test');
var Base = require('./base');

/**
 * Creates a new suite.
 *
 * @param {object} options
 */
function Suite(options) {
  var self = this;

  options = options || {};

  Suite.super_.apply(this, [options]);

  this._ee = new EventEmitter();
  this.name = options.name || null;
  this.description = options.description || null;

  this.tests = [];

  if (options.tests) {
    options.tests.forEach(function eachTest(test) {
      self.add(test);
    });
  }
}

inherit(Suite, Base);

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

Suite.prototype.off = function off(name, callback) {
  this._ee.off(name, callback);
  return this;
};

Suite.prototype.hasListener = function hasListener(name, callback) {
  var affected = this._ee._events[name];
  var index;

  if (!affected) {
    return false;
  }

  if (!callback) {
    return true;
  }

  if (Array.isArray(affected) && callback) {
    for (index = 0; index < affected.length; index++) {
      if (callback === affected[index]) {
        return true;
      }
    }
  }

  return affected === callback;
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
  this.tests.push(item);
  return this;
};

Suite.prototype.run = function run() {
  var suite = this;
  var offAny = [];

  function broadcast(test) {
    suite.emit('test', test);
  }

  function walk(item) {
    if (!(item instanceof Suite)) {
      return;
    }

    if (!item.hasListener('broadcast.test')) {
      item.on('broadcast.test', broadcast);
      offAny.push(function off() {
        item.off('broadcast.test', broadcast);
      });
    }

    item.tests.forEach(walk);
  }

  this.tests.forEach(walk);

  return Promise
    .map(this.tests, function each(item) {
      return item.run();
    })
    .then(function summarize(result) {
      return {
        suite: {
          name: suite.name,
          description: suite.description
        },
        tests: result.map(function mapResult(item) {
          return item;
        })
      };
    })
    .finally(function unbindBroadcasts() {
      offAny.forEach(function eachOff(off) {
        off();
      });
    })
  ;
};

Suite.prototype.runAsStream = function runAsStream() {
  var self = this;
  var stream = through2.obj(function eachTest(test, encoding, next) {
    this.push(test);
    next();
  });

  function onTest(item) {
    stream.push(item);
  }

  self
    .on('test', onTest)
    .run()
    .finally(function unbindOnTest() {
      self.off('test', onTest);
      stream.end();
    })
  ;

  return stream;
};

module.exports = Suite;
