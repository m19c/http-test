var should = require('should');
var validate = require('../../util/validate');

describe('http-test/util/validate', function validateTestSuite() {
  it('marks the test as "invalid" if a error is provided', function provideErrTest() {
    var result = validate({ err: new Error() });

    result.status.should.equal('invalid');
  });

  it('marks the test as "failed" if the statusCode is not successful', function failedTest() {
    var result = validate({ res: { statusCode: 400 } });

    result.status.should.equal('failed');
  });

  it('checks the given thresholds if provided', function thresholdTest() {
    var thresholds = [
      { threshold: 50, mark: 'passed', flags: ['fast'] },
      { threshold: 100, mark: 'passed', flags: ['ok'] },
      { threshold: 500, mark: 'failed', flags: ['awful'] }
    ];

    thresholds.forEach(function eachItem(expected) {
      var result = validate({
        res: {
          statusCode: 200,
          elapsedTime: expected.threshold - 1
        },
        req: {
          baseUrl: 'http://www.google.com',
          url: '/'
        },
        err: null,
        spec: {
          thresholds: thresholds
        }
      });

      result.status.should.equal(expected.mark);
      should(result.affectedThreshold).ok();
      result.affectedThreshold.should.equal(expected);
    });
  });
});
