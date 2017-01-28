var gulp = require('gulp'),
    less = require('gulp-less'),
    browserSync = require('browser-sync').create(),
    header = require('gulp-header'),
    cleanCSS = require('gulp-clean-css'),
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    pkg = require('./package.json');


// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2017-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');


// Compile LESS files from /less into /css
gulp.task('less', function() {
  return gulp.src('less/custom.less')
    .pipe(less())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
        stream: true
    }));
});


// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
    gulp.src([
      'node_modules/bootstrap/dist/**/*',
      '!**/npm.js',
      '!**/bootstrap-theme.*',
      '!**/*.map'
    ])
    .pipe(gulp.dest('vendor/bootstrap'));

    gulp.src([
      'node_modules/jquery/dist/jquery.js',
      'node_modules/jquery/dist/jquery.min.js'
    ])
    .pipe(gulp.dest('vendor/jquery'));

    gulp.src([
      'node_modules/font-awesome/**',
      '!node_modules/font-awesome/**/*.map',
      '!node_modules/font-awesome/.npmignore',
      '!node_modules/font-awesome/*.txt',
      '!node_modules/font-awesome/*.md',
      '!node_modules/font-awesome/*.json'
    ])
    .pipe(gulp.dest('vendor/font-awesome'));

})//end gulp.task


// NOTE: Concatinate CSS
gulp.task('concatStyles', function(){
  gulp.src([
    'vendor/font-awesome/css/font-awesome.css',
    'vendor/bootstrap/css/bootstrap.css',
    'css/custom.css'
  ])
  .pipe(concat('app.css'))
  .pipe(gulp.dest('css'));
})

// NOTE: Concatinate JS
gulp.task('concatScripts', function(){
  gulp.src([
    'vendor/jquery/jquery.js',
    'vendor/bootstrap/js/bootstrap.js',

    // Plugin JavaScript
    'vendor/jquery/jquery.easing.js',

    // Contact Form JavaScript
    'js/jqBootstrapValidation.js',
    'js/contact_me.js',

    // Theme JavaScript
    'js/freelancer.js'
  ])
  .pipe(concat('app.js'))
  .pipe(gulp.dest('js'));
});


// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    // return gulp.src('css/freelancer.css')
    return gulp.src('css/app.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('js/app.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});


// Run (all) gulp tasks
gulp.task('default', [
    'copy',
    'less',
    'concatScripts',
    'concatScripts',
    'minify-css',
    'minify-js'
]);


// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    })
});//end gulp.task

// Dev task with browserSync
gulp.task('dev', [
      'browserSync',
      'less',
      'minify-css',
      'minify-js'
      ], function() {
    gulp.watch('less/*.less', ['less']);
    gulp.watch('css/*.css', ['minify-css']);
    gulp.watch('js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
});//end gulp.task
