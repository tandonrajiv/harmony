/* Needed gulp config */
var gulp = require('gulp');
// var sass = require('gulp-sass');

var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
// var notify = require('gulp-notify');



var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');
// var compass = require('compass-importer');

// var series = require('stream-series');
// var sequence = require('gulp-sequence');


// var inject = require('gulp-inject');
// var del = require('del');

// var config = {

//   sassOptions: {
//     errLogToConsole: true,
//     outputStyle: 'expanded',
//     importer: compass
//   },

//   jsStream: gulp.src(['public/build/js/*.js'], {
//     read: false
//   }),

//   cssVendorStream: gulp.src(['public/build/css/vendor/*.js'], {
//     read: false
//   }),

//   cssAppStream: gulp.src(['public/build/js/app/*.js'], {
//     read: false
//   })

// };


// gulp.task('clean', function() {
//   return del([
//     'public/build/js/*',
//     'public/build/app.html'
//   ]);
// });


// gulp.task('inject-js', ['vendor-scripts'], function() {
//   return gulp.src('public/app.html')
//     .pipe(inject(config.jsStream, {
//       ignorePath: 'public'
//     })) // This will always inject vendor files before app files 
//     .pipe(gulp.dest('public'));
// });

/* Scripts task */
gulp.task('vendor-scripts', function() {
  return gulp.src([
      /* Add your JS files here, they will be combined in this order */
      'public/js/app.js'
    ])
    .pipe(concat('bundle_v_'))
    .pipe(rename({
      suffix: '.min.js'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('public/build/js'))
    .pipe(reload({
      stream: true
    }));
});

/* Scripts task */
gulp.task('scripts', function() {
  return gulp.src([
      /* Add your JS files here, they will be combined in this order */
      'public/js/app.js'
    ])
    .pipe(concat('bundle_c_'))
    .pipe(rename({
      suffix: '.min.js'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('public/build/js'))
    .pipe(reload({
      stream: true
    }));
});


/* Sass task */
gulp.task('sass', function() {
  gulp.src('public/scss/style.scss')
    .pipe(plumber())
    .pipe(gulp.dest('public/build/css'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minifycss())
    .pipe(gulp.dest('public/build/css'))
    /* Reload the browser CSS after every change */
    .pipe(reload({
      stream: true
    }));
});

/* Reload task */
gulp.task('bs-reload', function() {
  browserSync.reload();
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(['css/*.css', 'js/*.js'], {
    /*
    I like to use a vhost, WAMP guide: https://www.kristengrote.com/blog/articles/how-to-set-up-virtual-hosts-using-wamp, XAMP guide: http://sawmac.com/xampp/virtualhosts/
    */
    proxy: 'http://localhost:3010',
    /* For a static server you would use this: */
    /*
    server: {
        baseDir: './'
    }
    */
    // notice that the default port is 3000, which would clash with our expressjs
    files: ["public/build/*.*"],
    port: 4000

    // open the proxied app in chrome
  });
});

gulp.task('nodemon', function(cb) {
  console.log('cb', cb);
  var started = false;

  return nodemon({
    script: './www',
    ignore: ['public', 'node_modules']
  }).on('start', function() {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true;
    }
  });
});

/* Watch scss, js and html files, doing different things with each. */

gulp.task('default', ['browser-sync'], function() {
  /* Watch scss, run the sass task on change. */
  gulp.watch(['public/scss/*.scss', 'public/scss/**/*.scss'], ['sass']);
  /* Watch app.js file, run the scripts task on change. */
  gulp.watch(['public/js/app.js'], ['scripts']);
  /* Watch .html files, run the bs-reload task on change. */
  gulp.watch(['*.html'], ['bs-reload']);
});
