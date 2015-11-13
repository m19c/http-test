var defaults = require('lodash.defaultsdeep');
var isNumber = require('lodash.isnumber');
var isBoolean = require('lodash.isboolean');

function Base(options) {
  var self = this;

  options = options || {};

  this.req = defaults({}, options.req || {});
  this.spec = {
    thresholds: []
  };

  if (options.spec && options.spec.thresholds && options.spec.thresholds.length > 0) {
    options.spec.thresholds.forEach(function eachThreshold(item) {
      self.threshold(item.threshold, item.mark, item.flags);
    });

    delete options.spec.thresholds;
  }
}

Base.PASSED = 'passed';
Base.FAILED = 'failed';
Base.INVALID = 'invalid';

Base.prototype.threshold = function threshold(ms, mark, flags) {
  if (!isNumber(ms)) {
    throw new Error('Argument one passed to `threshold` must be a number');
  }

  if (isBoolean(mark)) {
    mark = (mark) ? Base.PASSED : Base.FAILED;
  }

  this.spec.thresholds.push({
    threshold: ms,
    mark: mark || Base.PASSED,
    flags: flags || []
  });

  return this;
};

module.exports = Base;
