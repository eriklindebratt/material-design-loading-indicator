/*global -$ */
(function() {
  'use strict';

  // generated on 2015-05-02 using generator-gulp-webapp 0.3.0
  var gulp = require('gulp');
  var $ = require('gulp-load-plugins')();
  var browserSync = require('browser-sync');
  var reload = browserSync.reload;

  gulp.task('styles', function() {
    return gulp.src('app/styles/main.scss')
      .pipe($.sourcemaps.init())
      .pipe($.sass({
        outputStyle: 'nested', // libsass doesn't support expanded yet
        precision: 10,
        includePaths: ['.'],
        onError: console.error.bind(console, 'Sass error:')
      }))
      .pipe($.postcss([
        require('autoprefixer-core')({ browsers: ['last 1 version'] })
      ]))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest('.tmp/styles'))
      .pipe(reload({ stream: true }));
  });

  gulp.task('html', ['styles'], function() {
    var assets = $.useref.assets({ searchPath: ['.tmp', 'app', '.'] });

    return gulp.src('app/*.html')
      .pipe(assets)
      .pipe($.if('*.css', $.csso()))
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.if('*.html', $.minifyHtml({ conditionals: true, loose: true })))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

  gulp.task('serve', ['styles'], function() {
    browserSync({
      notify: false,
      port: 9000,
      server: {
        baseDir: ['.tmp', 'app']
      }
    });

    // watch for changes
    gulp.watch('app/*.html').on('change', reload);
    gulp.watch('app/styles/**/*.scss', ['styles']);
  });

  gulp.task('build', ['html'], function() {
    return gulp.src('dist/**/*').pipe($.size({ title: 'build', gzip: true }));
  });

  gulp.task('default', ['clean'], function() {
    gulp.start('build');
  });
})();
