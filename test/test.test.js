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
      test.spec.should.deepEqual(options.spec);
    });

    it('accepts a suite as the second argument', function suiteSecondArgumentTest() {
      var suite = new Suite();
      var test = new Test({}, suite);

      test.suite.should.equal(suite);
    });
  });

  describe('#threshold', function thresholdTestSuite() {
    it('requires at least one argument (ms)', function atLeastOneArgumentTest() {
      (function shouldThrow() {
        var test = new Test();
        test.threshold();
      }).should.throw(Error);
    });

    it('accepts the second argument as a boolean value and translate it into a valid mark', function markBooleanTest() {
      var testA = new Test();
      var testB = new Test();

      testA.threshold(10, true);
      testB.threshold(10, false);

      testA.spec.thresholds.should.deepEqual([
        { threshold: 10, mark: Test.PASSED, flags: [] }
      ]);

      testB.spec.thresholds.should.deepEqual([
        { threshold: 10, mark: Test.FAILED, flags: [] }
      ]);
    });

    it('accepts 3 arguments', function fullArgumentStackTest() {
      var test = new Test();
      test.threshold(10, Test.PASSED, ['a', 'b', 'c']);

      test.spec.thresholds.should.have.length(1);
      test.spec.thresholds.should.have.deepEqual([
        { threshold: 10, mark: Test.PASSED, flags: ['a', 'b', 'c'] }
      ]);
    });

    it('returns an instance of `Test`', function returnTest() {
      var test = new Test();
      (test.threshold(1337)).should.equal(test);
    });
  });

  describe('#run', function runTestSuite() {
    it('returns a promise');
  });
});
