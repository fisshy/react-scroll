var gulp = require('gulp');

var SOURCE = './modules/**/*.js';
var DEST = './build/npm/lib'

gulp.task('default', function() {
	gulp.src(SOURCE)
  .pipe(gulp.dest(DEST));
});