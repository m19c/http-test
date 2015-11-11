describe('http-test/suite', function suiteTestSuite() {
  it('inherits from `Base`');

  describe('#constructor', function constructorTestSuite() {
    it('accepts an object with options');
    it('is describable');
    it('opens `tests` as a empty array');
    it('stores `options.tests` into a property');
  });

  describe('#on', function onTestSuite() {
    it('creates a new listener');
  });

  describe('#emit', function emitTestSuite() {
    it('emits an existing listener');
  });

  describe('#off', function offTestSuite() {
    it('unbinds an existing listener');
  });

  describe('#add', function addTestSuite() {
    it('accepts a string');
    it('accepts another suite');
    it('accepts an instance of `Test`');
  });

  describe('#run', function runTestSuite() {
    it('returns a promise');
  });

  describe('#runAsStream', function runAsStreamTestSuite() {
    it('returns a object stream');
  });
});
