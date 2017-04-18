var gulp = require('gulp');

var SOURCE_PACKAGE_JSON = './package.json';
var DEST_PACKAGE_JSON = './build/npm'

var SOURCE_README = '*.md';
var DEST_README = './build/npm';

gulp.task('default', function() {
	gulp.src(SOURCE_PACKAGE_JSON)
  	.pipe(gulp.dest(DEST_PACKAGE_JSON));

  	gulp.src(SOURCE_README)
  	.pipe(gulp.dest(DEST_README));
});
