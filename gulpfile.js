const gulp = require('gulp');
const gih = require("gulp-include-html");
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const gulpIgnore = require('gulp-ignore');
const print = require('gulp-print');

gulp.task('html', function() {
    return gulp.src('./src/**/*.html')
    .pipe(gih())
    //.pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('bin'));
});

gulp.task('png', function() {
    return gulp.src(['./src/**/*.png'])
    .pipe(imagemin())
    .pipe(gulp.dest('bin'));
});

gulp.task('static', function() {
    return gulp.src([
        './src/**/*.{json,css,js,ttf,yml,txt,mp3}',
        './src/_headers',
        './src/.well-known/*.*'
    ])
    .pipe(gulp.dest('bin'));
});

gulp.task('well-known', function() {
    return gulp.src('./src/.well-known/**')
    .pipe(print())
    .pipe(gulp.dest('bin/.well-known'));
})

gulp.task('default', [
    'html', 'static', 'well-known'
]);

gulp.task('all', [
    'default', 'png'
]);
