var ht = require('../../');
var reporter = require('../create-reporter')();
var suite = ht({
  name: 'JsonPlaceholder API',
  spec: {
    thresholds: [
      { threshold: 200, mark: ht.PASSED, flags: ['fast'] },
      { threshold: 500, mark: ht.PASSED, flags: ['ok'] },
      { threshold: 1000, mark: ht.FAILED, flags: ['awful'] }
    ]
  }
});

suite
  .add('http://jsonplaceholder.typicode.com/posts/1')
  .add('http://jsonplaceholder.typicode.com/posts/2')
  .add('http://jsonplaceholder.typicode.com/doesnt-exist/1337')
  .add('http://www.google.com')
;

suite.run()
  .then(function(item) {
    return item.tests;
  })
  .each(reporter)
;
