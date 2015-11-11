var ht = require('../../');
var through2 = require('through2');
var util = require('util');
var os = require('os');
var stream;
var main = ht({ name: 'Main Suite' });
var jpa;
var google;

jpa = ht({
  name: 'JsonPlaceholder API',
  req: {
    baseUrl: 'http://jsonplaceholder.typicode.com'
  },
  spec: {
    thresholds: [
      { threshold: 50, mark: true, flags: ['fast'] },
      { threshold: 100, mark: true, flags: ['ok'] },
      { threshold: 500, mark: true, flags: ['fast'] }
    ]
  }
});
jpa
  .add('/posts/1')
  .add('/posts/2')
  .add('/doesnt-exist/1337')
;

google = ht({
  name: 'Google',
  req: {
    baseUrl: 'http://www.google.com'
  }
});
google
  .add('/')
  .add('/mail')
;

main
  .add('http://www.heise.de')
  .add(jpa)
  .add(google)
;

stream = main.runAsStream();
stream
  .pipe(through2.obj(function eachTest(test, encoding, next) {
    console.log(Object.keys(test));
    this.push(util.format('%s > %s [%s]', test.suite, test.res.request.uri.href, test.status.status) + os.EOL);
    next();
  }))
  .pipe(process.stdout)
;
