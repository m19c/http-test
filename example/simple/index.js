var ht = require('../../');
var suite = ht({
  name: 'JsonPlaceholder API',
  spec: {
    thresholds: [
      { threshold: 50, mark: ht.PASSED, flags: ['fast'] },
      { threshold: 100, mark: ht.PASSED, flags: ['ok'] },
      { threshold: 500, mark: ht.FAILED, flags: ['fast'] }
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
  .each(function(test) {
    console.log(test.req.url, test.status);
  })
;
