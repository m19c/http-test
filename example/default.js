var ht = require('../');
var suite = ht({
  name: 'JsonPlaceholder API'
});

suite
  .add(
    ht.test({ req: { url: 'http://jsonplaceholder.typicode.com/posts/1' } })
      .threshold(5, ht.Test.PASSED, ['fast as hell'])
      .threshold(200, ht.Test.PASSED, ['fast'])
      .threshold(500, ht.Test.PASSED, ['slow'])
      .threshold(1000, ht.Test.FAILED, ['awful'])
  )
  .add('http://this-does-not-exist-really-really-really.com')
;

suite.run()
  .then(function handleResult(result) {
    console.log(JSON.stringify(result, null, 2));
  })
;
