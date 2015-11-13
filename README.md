http-test
=========
A simple and robust way to test your http endpoints.

[![Build Status](https://travis-ci.org/MrBoolean/http-test.svg?branch=master)](https://travis-ci.org/MrBoolean/http-test) [![Code Climate](https://codeclimate.com/github/MrBoolean/http-test/badges/gpa.svg)](https://codeclimate.com/github/MrBoolean/http-test) [![Test Coverage](https://codeclimate.com/github/MrBoolean/http-test/badges/coverage.svg)](https://codeclimate.com/github/MrBoolean/http-test/coverage)

# Install
```
npm i --save http-test
```

# Example
## Using promises
```javascript
var ht = require('http-test');

ht({
  name: 'http-test'
})
  .add('http://www.google.com')
  .add('http://www.creativemarket.com')
  .run()
  .then(function(result) {
    // ...
  })
;
```

## Using streams
```javascript
var ht = require('http-test');
var through2 = require('through2');

ht({
  name: 'http-test'
})
  .add('http://www.google.com')
  .add('http://www.creativemarket.com')
  .runAsStream()
  .pipe(through2.obj(function(item, encoding, next) {
    this.push(JSON.stringify(item, null, 2));
    next();
  }))
  .pipe(process.stdout)
;
```

# License
Copyright (c) 2015 Marc Binder <marcandrebinder@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
