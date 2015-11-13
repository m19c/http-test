var nock = require('nock');
var through2 = require('through2');
var Suite = require('../suite');
var Test = require('../test');
var Base = require('../base');

describe('http-test/suite', function suiteTestSuite() {
  it('inherits from `Base`', function inheritsFromBaseTest() {
    (new Suite()).should.be.an.instanceOf(Base);
  });

  describe('#constructor', function constructorTestSuite() {
    it('accepts an object with options', function acceptsOptionsTest() {
      var options = {
        req: { baseUrl: 'http://www.mr-boolean.com' },
        spec: { thresholds: [{ threshold: 1337, mark: Test.PASSED }] }
      };
      var suite = new Suite(options);

      suite.req.should.deepEqual(options.req);

      suite.should.propertyByPath('spec', 'thresholds', 0).eql({
        threshold: 1337,
        mark: Test.PASSED,
        flags: []
      });
    });

    it('opens `tests` as a empty array', function openEmptyTestsArrayTest() {
      var suite = new Suite();
      suite.tests.should.have.length(0);
    });

    it('stores `options.tests` into a property', function acceptsTestsTest() {
      var tests = [new Test()];
      var suite = new Suite({ tests: tests });

      suite.tests.should.deepEqual(tests);
    });
  });

  describe('#on', function onTestSuite() {
    it('creates a new listener', function onTest() {
      var suite = new Suite();

      function onRequest() {}

      suite.on('request', onRequest);

      suite._ee._events.should.have.property('request');
      suite._ee._events.request.should.equal(onRequest);
    });
  });

  describe('#emit', function emitTestSuite() {
    it('emits an existing listener', function emitsListenerTest(done) {
      var suite = new Suite();

      suite.on('test', function onTest() {
        done();
      });

      suite.emit('test');
    });
  });

  describe('#off', function offTestSuite() {
    it('unbinds an existing listener', function unbindListenerTest() {
      var suite = new Suite();

      function onRequest() {}

      suite.on('request', onRequest);

      suite._ee._events.should.have.property('request');
      suite._ee._events.request.should.equal(onRequest);

      suite.off('request', onRequest);
      suite._ee._events.should.not.have.property('request');
    });
  });

  describe('#add', function addTestSuite() {
    it('accepts a string', function stringTest() {
      var suite = new Suite();

      suite.add('http://www.google.com');

      suite.tests.should.have.length(1);
      suite.should.have.propertyByPath('tests', 0, 'req', 'url').equal('http://www.google.com');
    });

    it('accepts another suite', function anotherSuiteTest() {
      var suiteA = new Suite();
      var suiteB = new Suite();

      suiteA.add(suiteB);

      suiteA.tests.should.have.length(1);
      suiteA.should.have.propertyByPath('tests', 0).equal(suiteB);
    });

    it('accepts an instance of `Test`', function testAddTest() {
      var suite = new Suite();
      var test = new Test();

      suite.add(test);

      suite.tests.should.have.length(1);
      suite.should.have.propertyByPath('tests', 0).equal(test);
    });

    it('accepts an object', function objectTest() {
      var suite = new Suite();

      suite.add({ req: { url: 'http://www.google.com' } });

      suite.tests.should.have.length(1);
      suite.should.have.propertyByPath('tests', 0, 'req', 'url').equal('http://www.google.com');
    });
  });

  describe('#hasListener', function hasListenerTest() {
    it('returns `true` if a single listener already exist', function existTest() {
      var suite = new Suite();

      function someListener() {}

      suite.hasListener('some').should.be.false();

      suite.on('some', someListener);

      suite.hasListener('some').should.be.true();
      suite.hasListener('some', function noop() {}).should.be.false();
      suite.hasListener('some', someListener).should.be.true();
    });

    it('returns `true` if a multiple listeners already present', function existTest() {
      var suite = new Suite();

      function someListener() {}

      suite.hasListener('some').should.be.false();

      suite.on('some', someListener);
      suite.on('some', function noop() {});

      suite.hasListener('some').should.be.true();
      suite.hasListener('some', someListener).should.be.true();
    });
  });

  describe('functional testing', function functionalTestSuite() {
    var baseUrl = 'http://www.http-test.com';
    var mock;

    beforeEach(function runBeforeEach() {
      mock = nock(baseUrl);

      mock.get('/').delay(200).reply(200, {});
      mock.get('/api/user').delay(200).reply(200, {});
    });

    afterEach(function runAfterEach() {
      mock.done();
    });

    it('broadcasts all events to sub suites', function broadcastTest() {
      var main = new Suite();
      var httpTestCom = new Suite({ req: { baseUrl: baseUrl } });
      var httpTestComApi = new Suite({ req: { baseUrl: baseUrl + '/api' } });
      var called = 0;

      httpTestComApi.add('/user');
      httpTestCom.add(httpTestComApi);

      httpTestCom.add('/');
      main.add(httpTestCom);

      main.on('test', function onTest() {
        called++;
      });

      return main.run().then(function allDone() {
        called.should.equal(2);
      });
    });

    it('also works as a stream', function streamTest(done) {
      var suite = new Suite();
      var called = 0;

      suite.add(baseUrl + '/');
      suite.add(baseUrl + '/api/user');

      suite.runAsStream()
        .on('end', function onEnd() {
          called.should.equal(2);
          done();
        })
        .pipe(through2.obj(function handle(test, encoding, next) {
          called++;
          next();
        }))
      ;
    });
  });
});
