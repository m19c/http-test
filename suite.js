var defaults = require('lodash.defaultsdeep');
var isString = require('lodash.isstring');
var Test = require('./test');

function Suite(options) {
  this.options = defaults({}, options || {}, {
    name: null,
    request: {}
  });

  this.tests = [];
}

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

Suite.prototype.run = function run() {
};

module.exports = Suite;
