var gulp = require('gulp');

var SOURCE = './modules/**/*.js';
var DEST = './build/npm/lib'

var SOURCE_README = '*.md';
var DEST_README = './build/npm';

gulp.task('default', function() {
	gulp.src(SOURCE)
  	.pipe(gulp.dest(DEST));

  	gulp.src(SOURCE_README)
  	.pipe(gulp.dest(DEST_README));
});