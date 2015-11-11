var ht = require('../../');
var suite = ht({
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

suite
  .add('/posts/1')
  .add('/posts/2')
  .add('/doesnt-exist/1337')
;

suite.run()
  .then(function handleResult(result) {
    console.log(JSON.stringify(result, null, 2));
  })
;
