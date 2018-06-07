const gulp = require("gulp");
const gih = require("gulp-include-html");
const htmlmin = require("gulp-htmlmin");

gulp.task("html", function() {
    return gulp.src("./src/**/*.html")
    .pipe(gih())
    //.pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("bin"));
});

gulp.task("static", function() {
    return gulp.src(["./static/**/*.*"])
    .pipe(gulp.dest("bin"));
});

gulp.task("static-2", function() {
    return gulp.src(["./src/**/*.{png,ico,txt,c,bmp,ttf,js,css,mp3,yml,json}"])
    .pipe(gulp.dest("bin"));
});

gulp.task("netlify", function() {
    return gulp.src("./static/_headers").pipe(gulp.dest("bin"));
});

gulp.task("site-dev", [
    "html",
    "static-2",
]);

gulp.task("default", [
    "site-dev",
    "static",
    "netlify",
]);
