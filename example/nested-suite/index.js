var ht = require('../../');
var createReporter = require('../create-reporter');
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

main.run()
  .then(function(result) {
    function createWalker(suite) {
      var reporter = createReporter(suite);

      return function walk(item) {
        var stack;

        if (item.tests) {
          stack = (suite) ? [suite] : [];
          stack.push(item.suite.name);

          return item.tests.forEach(createWalker(stack.join(' > ')));
        }

        reporter(item);
      };
    }

    result.tests.forEach(createWalker(result.suite.name));
  })
;
