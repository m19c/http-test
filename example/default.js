var ht = require('../');
var suite = ht({
  name: 'JsonPlaceholder API'
});

suite
  .add(
    ht.test({ request: { url: 'http://jsonplaceholder.typicode.com/posts/1' } })
      .threshold(5, suite.PASSED, ['fast as hell'])
      .threshold(200, suite.PASSED, ['fast'])
      .threshold(500, suite.PASSED, ['slow'])
      .threshold(1000, suite.FAILED)
      .shouldBeSuccessful()
  )
  .add('http://this-does-not-exist-really-really-really.com')
;

suite.run()
  .then(function handleResult(result) {
    console.log(result);
  })
;
