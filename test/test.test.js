describe('http-test/test', function testTestSuite() {
  it('inherits from `Base`');
  it('contains the static PASSED');
  it('contains the static FAILED');
  it('contains the static INVALID');

  describe('#constructor', function constructorTestSuite() {
    it('accepts an object with options');
    it('accepts an instance of `Suite` as the second argument');
  });

  describe('#threshold', function thresholdTestSuite() {
    it('requires at least one argument (ms)');
    it('sets `Test.PASSED` as default for the second argument');
    it('accept `flags` as the third argument');
    it('returns an instance of `Test`');
  });

  describe('#run', function runTestSuite() {
    it('returns a promise');
  });
});
