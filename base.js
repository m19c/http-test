var defaults = require('lodash.defaultsdeep');

function Base(options) {
  options = options || {};

  this.req = defaults({}, options.req || {});
  this.spec = defaults({
    thresholds: []
  }, options.spec);
}

module.exports = Base;
