var ht = require('../../');
var name = 'Google';
var through2 = require('through2');
var reporter = require('../create-reporter')(name);
var stream;
var suite = ht({
  name: name,
  req: {
    baseUrl: 'http://www.google.de'
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
suite.add('/mail');

stream = suite.runAsStream();
stream
  .pipe(through2.obj(function eachTest(test, encoding, next) {
    reporter(test);
    next();
  }))
  .pipe(process.stdout)
;
