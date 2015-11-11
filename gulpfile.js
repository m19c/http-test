var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

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
      dir: './dist/test-report'
    }))
  ;
});

gulp.task('default', ['lint', 'test']);
