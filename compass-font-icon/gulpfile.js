//------------------------------------------------ Paths config

var paths = {
  templates : 'templates/',
  icons     : 'icons/',
  fonts     : 'fonts/',
  scss      : 'scss/',
  css       : 'css/',
  js        : 'js/'
};

//------------------------------------------------ Resources

var autoprefixer     = require('autoprefixer'),
    gulp             = require('gulp'),
    concat           = require('gulp-concat'),
    postcss          = require('gulp-postcss'),
    sass             = require('gulp-sass'),
    sourcemaps       = require('gulp-sourcemaps'),
    svg2ttf          = require('gulp-svg2ttf'),
    svgicons2svgfont = require('gulp-svgicons2svgfont'),
    tap              = require('gulp-tap'),
    template         = require('gulp-template'),
    ttf2woff         = require('gulp-ttf2woff'),
    ttf2eot				   = require('gulp-ttf2eot'),
    uglify           = require('gulp-uglify'),
    clone            = require('gulp-clone'),
    cloneSink        = clone.sink(),

    compass = require('gulp-for-compass'),
    minifyCSS = require('gulp-minify-css'),
    combineMediaQueries = require('gulp-combine-media-queries'),
    autoprefixer = require('gulp-autoprefixer'),

  //js plugins
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),

  // Image plugins
    imagemin = require('gulp-imagemin'),
    svgmin = require('gulp-svgmin'),
    svgSprite = require("gulp-svg-sprites"),

  // General plugins
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    notify = require('gulp-notify');
//------------------------------------------------ Helpers

//------------------------ Prevents errors breaking watch

// See: http://stackoverflow.com/a/23973536

function swallowError(error) {
  console.log(error.toString());
  this.emit('end');
}

//------------------------------------------------ Tasks

//------------------------ Font icons

gulp.task('icons', function() {
   return gulp.src([paths.icons + '*.svg'])
    // .pipe(svgSprite(
    //   {
    //     mode: 'sprite',
    //     baseSize: 16,
    //     preview: false,
    //     cssFile: false,
    //     svg:{
    //       sprite:'zafont-400-normal.svg'
    //     }
    //   }
    // ))
    // .pipe(gulp.dest(paths.fonts))
    .pipe(svgicons2svgfont({
      fontName   : 'zafont-400-normal',
      normalize  : true,
      fontHeight : 1000,
      ignoreExt : true,
      log        : function() {} // Silence
    }))
    .on('glyphs', function(glyphs) {
      gulp.src(paths.templates + '_icons.scss')
        .pipe(template({ glyphs: glyphs }))
        .pipe(gulp.dest(paths.scss));
    })
    .pipe(gulp.dest(paths.fonts))
    .pipe(svg2ttf())
    .pipe(cloneSink)
    // clone objects streaming through this point
    .pipe(gulp.dest(paths.fonts))
    .pipe(ttf2eot())
    .pipe(gulp.dest(paths.fonts))
    .pipe(cloneSink.tap())
    .pipe(ttf2woff())
    .pipe(gulp.dest(paths.fonts));
});

// gulp.task('fonts', function() {
//   var fonts = {};
//   gulp.src([paths.fonts + '*.ttf'])
//     .pipe(ttf2woff())
//     .pipe(tap(function(file) {
//       var chunks  = file.path.substring(file.path.lastIndexOf('/') + 1, file.path.lastIndexOf('.')).split('-'),
//           variant = {
//                       style  : chunks.pop(),
//                       weight : chunks.pop(),
//                       base64 : file.contents.toString('base64')
//                     };
//       chunks.forEach(function(string, i, array) { array[i] = string[0].toUpperCase() + string.slice(1) });
//       var family = chunks.join(' ');
//       if (fonts.hasOwnProperty(family)) fonts[family].push(variant);
//       else fonts[family] = [variant];
//     }))
//     .on('end', function() {
//       gulp.src(paths.templates + '_fonts.scss')
//         .pipe(template({ fonts: fonts }))
//         .pipe(gulp.dest(paths.scss));
//     });
// });

//------------------------ Styles

gulp.task('styles', function() {
    return gulp.src('./scss/**/*.scss')
        //compile sass
        .pipe(compass(
          {
            sassDir: 'scss',
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
// gulp.task('styles', function() {
//   gulp.src(paths.scss + '**/*.scss')
//     .pipe(sass({ outputStyle: 'compressed' }))
//     .on('error', swallowError)
//     .pipe(postcss([
//       autoprefixer({
//         browsers : ['last 2 versions', 'IE 9'],
//         cascade  : false
//       })
//     ]))
//     .pipe(gulp.dest(paths.css));
// });

//------------------------ Scripts

gulp.task('scripts', function() {
  gulp.src([
    paths.js + 'src/polyfills/**/*.js',
    paths.js + 'src/lib/**/*.js',
    paths.js + 'src/plugins/**/*.js',
    paths.js + 'src/*.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(uglify({ mangle: false }))
    .on('error', swallowError)
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.js));
});

//------------------------------------------------ Default tasks

gulp.task('default', function() {
  gulp.start('icons', 'styles', 'scripts');
});

//------------------------------------------------ Watch tasks

gulp.task('watch', function() {
  // gulp.watch(paths.fonts + '**/*.ttf', ['fonts']);
  gulp.watch(paths.icons + '**/*.svg', ['icons']);
  gulp.watch(paths.scss + '**/*.scss', ['styles']);
  gulp.watch(paths.js + 'src/**/*.js', ['scripts']);
});
