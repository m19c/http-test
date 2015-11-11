var ht = require('../../');
var os = require('os');
var through2 = require('through2');
var stream;
var suite = ht({
  name: 'GodmodeTrader',
  req: {
    baseUrl: 'http://www.godmode-trader.de'
  },
  spec: {
    thresholds: [
      { threshold: 50, mark: 'passed', flags: ['fast'] },
      { threshold: 200, mark: 'passed', flags: ['ok'] },
      { threshold: 600, mark: 'passed', flags: ['slow'] },
      { threshold: 1000, mark: 'passed', flags: ['awful'] }
    ]
  }
});

suite.add('/');
suite.add('/');

stream = suite.runAsStream();
stream
  .pipe(through2.obj(function eachTest(test, encoding, next) {
    this.push(JSON.stringify(test, null, 2) + os.EOL);
    next();
  }))
  .pipe(process.stdout)
;
