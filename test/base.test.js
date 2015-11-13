var Base = require('../base');

describe('http-test/base', function baseTestSuite() {
  describe('#constructor', function constructorTestSuite() {
    it('applies `options.req` with the property `req`', function appliesTheReqOptionsTest() {
      var base = new Base({ req: { baseUrl: 'http://www.google.com' } });
      base.req.baseUrl.should.equal('http://www.google.com');
    });

    it('applies `options.spec` with the property `spec`', function appliesThresholdsTest() {
      var threshold = { threshold: 1337, mark: false };
      var base = new Base({ spec: {
        thresholds: [
          threshold
        ]
      } });

      base.spec.thresholds.should.deepEqual([threshold]);
    });
  });

  describe('#threshold', function thresholdTestSuite() {
    it('requires at least one argument (ms)', function atLeastOneArgumentTest() {
      (function shouldThrow() {
        var test = new Base();
        test.threshold();
      }).should.throw(Error);
    });

    it('accepts the second argument as a boolean value and translate it into a valid mark', function markBooleanTest() {
      var testA = new Base();
      var testB = new Base();

      testA.threshold(10, true);
      testB.threshold(10, false);

      testA.spec.thresholds.should.deepEqual([
        { threshold: 10, mark: Base.PASSED, flags: [] }
      ]);

      testB.spec.thresholds.should.deepEqual([
        { threshold: 10, mark: Base.FAILED, flags: [] }
      ]);
    });

    it('accepts 3 arguments', function fullArgumentStackTest() {
      var test = new Base();
      test.threshold(10, Base.PASSED, ['a', 'b', 'c']);

      test.spec.thresholds.should.have.length(1);
      test.spec.thresholds.should.have.deepEqual([
        { threshold: 10, mark: Base.PASSED, flags: ['a', 'b', 'c'] }
      ]);
    });

    it('returns an instance of `Test`', function returnTest() {
      var test = new Base();
      (test.threshold(1337)).should.equal(test);
    });
  });
});
