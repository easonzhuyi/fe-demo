// 引入 gulp
var gulp = require('gulp');
// 引入组件

//css plugins
//var sass = require('gulp-sass');
var compass = require('gulp-for-compass');
var minifyCSS = require('gulp-minify-css');
var combineMediaQueries = require('gulp-combine-media-queries');
var autoprefixer = require('gulp-autoprefixer');

//js plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

// Image plugins
var imagemin = require('gulp-imagemin');
var svgmin = require('gulp-svgmin');

// General plugins
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var notify = require('gulp-notify');

// 编译Compass
gulp.task('css', function() {
    return gulp.src('./source/**/*.scss')
        //compile sass
        .pipe(compass(
          {
            sassDir: './source',
            cssDir: 'css',
            imagesDir: 'images',
            fontsDir: 'fonts',
            environment: 'dev',
            relativeAssets: true,
            sourcemap: true,
            force: true,
            outputStyle: 'compact'
          }
        ))
        // Compile Sass
        //.pipe(sass({ style: 'compressed', noCache: true }))
        // Combine media queries
        //.pipe(combineMediaQueries())
        // parse CSS and add vendor-prefixed CSS properties
        .pipe(autoprefixer())
        .pipe(gulp.dest('./css'))
        .pipe(minifyCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./css'))
});

gulp.task('js', function() {
    return gulp.src('./source/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        //.pipe(jshint())
        .pipe(gulp.dest('./js/'))
});

// Image tasks
//gulp.task('images', function() {
    //return gulp.src('src/images/raster/*')
        //// Minify the images
        //.pipe(imagemin())
        //// Where to store the finalized images
        //.pipe(gulp.dest('./images'))
        //// Notify us that the task was completed
        //.pipe(notify({ message: 'Image task complete' }));
//});

// SVG tasks
//gulp.task('svgs', function() {
    //return gulp.src('src/images/vector/*')
        //// Minify the SVG's
        //.pipe(svgmin())
        //// Where to store the finalized SVG's
        //.pipe(gulp.dest('./images'))
        //// Notify us that the task was completed
        //.pipe(notify({ message: 'SVG task complete' }));
//});

// browser-sync task for starting the server.
gulp.task('browser-sync', function() {
    browserSync({
      ui:false
      ,
      proxy: 'localhost'
    });
});
//gulp.task('browser-sync', function() {
    //browserSync({
        //dev: {
            //bsFiles: {
                //src : [
                    //'./css/**/*.css',
                    //'./images/**/*.jpg',
                    //'./images/**/*.png',
                    //'./js/**/*.js',
                    //'./**/*.php',
                    //'./**/*.html',
                    //'./**/*.htm'
                //]
            //},
            //options: {
                //watchTask: true,
                //debugInfo: true,
                //host : "10.211.55.7",
                ////port : '88',
                //ghostMode: {
                    //clicks: true,
                    //scroll: true,
                    //links: true,
                    //forms: true
                //}
            //}
        //}
    //})
//});

// Watch files for changes
gulp.task('watch', function() {
    // Watch HTML files
    gulp.watch(['*.htm','*.php'], reload);
    // Watch Sass files
    gulp.watch('source/**/*.scss', ['css',reload]);
    // Watch JS files
    gulp.watch('source/**/*.js', ['js',reload]);
    // Watch image files
    //gulp.watch('src/images/raster/*', ['images']);
    // Watch SVG files
    //gulp.watch('src/images/vector/*', ['svgs']);
});

// 默认任务
gulp.task('default', ['css','js','watch','browser-sync']);
