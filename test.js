var defaults = require('lodash.defaultsdeep');

function Test(options) {
  this.options = defaults({}, options || {}, {
    request: {}
  });
}

module.exports = Test;
