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
});
