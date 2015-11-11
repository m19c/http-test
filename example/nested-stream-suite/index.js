var ht = require('../../');
var through2 = require('through2');
var os = require('os');

var stream;
var suite = ht({
  name: 'JsonPlaceholder API',
  req: {
    baseUrl: 'http://jsonplaceholder.typicode.com'
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
suite.add('/not-found');

stream = suite.runAsStream();
stream
  .pipe(through2.obj(function eachTest(test, encoding, next) {
    this.push(JSON.stringify(test, null, 2) + os.EOL);
    next();
  }))
  .pipe(process.stdout)
;
