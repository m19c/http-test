var util = require('util');
var chalk = require('chalk');
var map = {
  passed: chalk.green.bold,
  failed: chalk.red.bold,
  invalid: chalk.red.bold.inverse
};

module.exports = function createReporter(suite) {
  return function report(item) {
    console.log(util.format(
      '%s | %s (%sms)',
      chalk.blue((suite) ? suite + ' > ' : '') + chalk.white(item.req.url),
      map[item.status.status](item.status.status),
      item.status.elapsedTime
    ));
  };
};
