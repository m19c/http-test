/**
 * @module http-test/util/validate
 */

var isSuccess = require('is-success');
var clone = require('lodash.clone');

module.exports = function validate(item) {
  var index;
  var current;
  var thresholds;
  var result = {
    status: 'passed',
    elapsedTime: (item.res) ? item.res.elapsedTime : null,
    statusCode: (item.res) ? item.res.statusCode : null,
    affectedThreshold: null
  };

  if (item.err instanceof Error) {
    result.status = 'invalid';
  }

  if (item.res && !isSuccess(item.res.statusCode)) {
    result.status = 'failed';
  }

  if (result.status === 'passed' && item.spec.thresholds && item.spec.thresholds.length > 0) {
    thresholds = clone(item.spec.thresholds);
    thresholds.sort(function sortByThreshold(thresholdA, thresholdB) {
      return thresholdA.threshold > thresholdB.threshold;
    });

    for (index = 0; index < thresholds.length; index++) {
      current = thresholds[index];

      if (result.elapsedTime <= current.threshold) {
        result.affectedThreshold = current;
        break;
      }
    }

    if (!result.affectedThreshold) {
      result.affectedThreshold = thresholds[item.spec.thresholds.length - 1];
    }

    if (result.affectedThreshold.mark) {
      result.status = result.affectedThreshold.mark;
    }
  }

  return result;
};
