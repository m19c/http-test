var Suite = require('../suite');
var Test = require('../test');
var Base = require('../base');
var ht = require('../');

describe('http-test', function httpTestSuite() {
  it('offers the function `createSuite` to create a new suites', function createSuiteTest() {
    ht.should.be.a.Function();
    ht.name.should.equal('createSuite');

    ht().should.be.an.instanceOf(Suite);
  });

  it('offers the function `test` to create new tests', function fnTest() {
    ht.test.should.be.a.Function();
    ht.test.name.should.equal('createTest');

    ht.test().should.be.an.instanceOf(Test);
  });

  it('includes cross module references', function crossModuleReferenceTest() {
    ht.Test.should.equal(Test);
    ht.Suite.should.equal(Suite);
    ht.Base.should.equal(Base);
  });
});
