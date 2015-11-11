var Suite = require('../suite');
var Test = require('../test');
var ht = require('../');

describe('http-test', function() {
  it('offers the function `createSuite` to create a new suites', function() {
    ht.should.be.a.Function();
    ht.name.should.equal('createSuite');

    ht().should.be.an.instanceOf(Suite);
  });

  it('offers the function `test` to create new tests', function() {
    ht.test.should.be.a.Function();
    ht.test.name.should.equal('createTest');

    ht.test().should.be.an.instanceOf(Test);
  });

  it('includes cross module references', function() {
    ht.Test.should.equal(Test);
    ht.Suite.should.equal(Suite);
  });
});
