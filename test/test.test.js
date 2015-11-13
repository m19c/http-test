var Test = require('../test');
var Suite = require('../suite');
var Base = require('../base');

describe('http-test/test', function testTestSuite() {
  it('inherits from `Base`', function inheritsFromBaseTest() {
    (new Test()).should.be.an.instanceOf(Base);
  });

  it('contains the static PASSED', function passedTest() {
    Test.PASSED.should.be.ok();
    Test.PASSED.should.equal('passed');
  });

  it('contains the static FAILED', function failedTest() {
    Test.FAILED.should.be.ok();
    Test.FAILED.should.equal('failed');
  });

  it('contains the static INVALID', function invalidTest() {
    Test.INVALID.should.be.ok();
    Test.INVALID.should.equal('invalid');
  });

  describe('#constructor', function constructorTestSuite() {
    it('accepts an object with options', function acceptsOptionsTest() {
      var options = {
        req: { url: '/test' },
        spec: { thresholds: [{ threshold: 1337, mark: Test.PASSED }] }
      };
      var test = new Test(options);

      test.req.should.deepEqual(options.req);
      test.should.propertyByPath('spec', 'thresholds', 0).eql({
        threshold: 1337,
        mark: Test.PASSED,
        flags: []
      });
    });

    it('accepts a suite as the second argument', function suiteSecondArgumentTest() {
      var suite = new Suite();
      var test = new Test({}, suite);

      test.suite.should.equal(suite);
    });
  });
});
