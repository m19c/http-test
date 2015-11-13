var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var codeclimate = require('gulp-codeclimate-reporter');
var path = require('path');

gulp.task('lint', function lintJs() {
  return gulp
    .src([
      '!node_modules/**/*',
      '!dist/**/*',
      '**/*.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
  ;
});

gulp.task('test.instrument', function instrument() {
  return gulp
    .src([
      '!node_modules/**/*',
      '!dist/**/*',
      '!example/**/*',
      '!gulpfile.js',
      '!test/**/*',
      '**/*.js'
    ])
    .pipe(istanbul({
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire())
  ;
});

gulp.task('test', ['test.instrument'], function test() {
  process.env.NODE_ENV = 'test';

  return gulp
    .src(['test/**/*.test.js'])
    .pipe(mocha({
      require: ['./test/bootstrap']
    }))
    .pipe(istanbul.writeReports({
      dir: './dist/report'
    }))
  ;
});

gulp.task('codeclimate', function sendToCodeclimate() {
  return gulp
    .src(['dist/report/lcov.info'], { read: false })
    .pipe(codeclimate({
      executable: path.join(process.cwd(), 'node_modules', '.bin', 'codeclimate-test-reporter'),
      token: '62640c23195506f0182de9ce4c7e616c088c266f630e596b5c4a1f44bc580bea'
    }))
  ;
});

gulp.task('default', ['lint', 'test']);
