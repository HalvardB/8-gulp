"use strict";

const gulp = require("gulp");
const concat = require("gulp-concat");
const minify = require("gulp-uglify");
const maps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const cleanCSS = require('gulp-clean-css');
const imagemin = require("gulp-imagemin");
const del = require('del');
const browserSync = require('browser-sync').create();
const runSequence = require('run-sequence');

// Concatinate and minify JavaScript files
gulp.task("scripts", function(done){
  return gulp.src("./js/**/*.js")
    .pipe(maps.init())
    .pipe(concat("all.min.js"))
    .pipe(minify())
    .pipe(maps.write("./"))
    .pipe(gulp.dest("./dist/scripts"));
  done();
});

// Compiling SCSS files into CSS, then concat and minify
gulp.task("styles", function(done){
  return gulp.src(['sass/global.scss','sass/_variables.scss'])
    .pipe(maps.init())
    .pipe(sass())
    .pipe(concat("all.min.css"))
    .pipe(cleanCSS())
    .pipe(maps.write("./"))
    .pipe(gulp.dest("./dist/styles"));
  done();
});

// Image command - minifying images
gulp.task('images', function (done) {
  return gulp.src('images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/content'));
  done();
});

// Clean command - deleting dist folder.
gulp.task("clean", function(done){
  del("dist");
  done();
});

// Build command
gulp.task("build", function(){
  return runSequence('clean', ['styles', 'scripts', 'images']);
});

// Running "styles" and reloading the browser after SCSS changes.
gulp.task('scss-watch', ['styles'], function () {
  browserSync.reload();
});

// Gulp command - run "build", launch Browsersync and watch SCSS files
gulp.task('default', ['build'], function () {

  // Launching the project in the browser automatically
  setTimeout(function(){
    browserSync.init({
      server: {
        baseDir: "./"
      }
    });
  }, 1000); // To make sure the css file is ready

  // Watch SCSS files for changes.
  gulp.watch("sass/**/*.sass", ['scss-watch']);
});
