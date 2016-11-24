var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var stripDebug = require('gulp-strip-debug');

var jsArr = ["public/lib/jquery/dist/jquery.min.js","public/lib/device.js/lib/device.min.js","public/lib/vue/dist/vue.min.js","public/lib/semantic/dist/semantic.js","public/js/main.js"];

gulp.task('lint', function() {
    gulp.src('public/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

var hj = 'dev';

gulp.task('minifyScript', function() {

    var outPut = 'public/dist';

    return gulp.src(jsArr)
        .pipe(concat('build.dev.js'))
        .pipe(gulp.dest(outPut))
        .pipe(stripDebug())
        .pipe(rename({ basename: 'build' }))
        .pipe(gulp.dest(outPut))
        .pipe(uglify({ outSourceMap: false }))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(outPut));
});


gulp.task('default', function() {
    
    gulp.run('lint', 'minifyScript');

    gulp.watch(jsArr, function() {
        gulp.run('lint', 'minifyScript');
    });
});
