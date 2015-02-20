'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var karma = require('karma').server;
var path = require('path');
var $ = require('gulp-load-plugins')();
var pkg = require('./bower.json');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');


var folders = {
    bower: 'test/app/bower_components',
    src: 'src',
    dist: 'dist',
    app: 'test/app',
    tmp: 'test/.tmp'
};

var files = {
    src: {
        scripts: [
            'src/*.js',
            'src/**/*.js'
        ]
    },
    test: {
        specs: [
            'test/specs/*-spec.js',
            'test/specs/**/*-spec.js'
        ]
    },
    app: {
        watch: [
            'test/app/*.html',
            'test/app/views/*.html',
            'test/app/views/**/*.html',
            'test/app/scripts/*.js',
            'test/app/scripts/**/*.js',
            'test/app/styles/*.css',
            'test/app/styles/**/*.css',
            'test/.tmp/styles/*.css',
            'test/.tmp/styles/**/*.css'
        ],
        sass: [
            'test/app/styles/**/*.scss'
        ]
    }
};

var banner = [
    '/**! ',
    ' * @license <%= pkg.name %> v<%= pkg.version %>',
    ' * Copyright (c) 2013 <%= pkg.author %>. <%= pkg.homepage %>',
    ' * License: MIT',
    ' */\n'
].join('\n');


gulp.task('test', function () {
    karma.start({
        configFile: path.resolve('karma.conf.js'),
        browsers: ['PhantomJS'],
        singleRun: true
    }, function (exitCode) {
        gutil.log('Karma has exited with ' + exitCode);
        process.exit(exitCode);
    });
});

gulp.task('test-debug', function () {
    karma.start({
        configFile: path.resolve('karma.conf.js'),
        singleRun: false,
        reporters: ['dots', 'progress', 'junit']
    }, function (exitCode) {
        gutil.log('Karma has exited with ' + exitCode);
        process.exit(exitCode);
    });
});

gulp.task('sass', function () {
    return gulp.src(files.app.sass)
        .pipe($.rubySass({
            style: 'expanded',
            compass: true,
            loadPath: folders.app
        }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest(folders.tmp + '/styles'))
        .pipe($.size());
});

gulp.task('scripts', function () {
    return gulp.src(files.src.scripts)
        .pipe($.jshint())
        .pipe($.jshint.reporter($.jshintStylish))
        .pipe($.header(banner, { pkg: pkg }))
        .pipe($.concat(pkg.name + '.js'))
        .pipe(gulp.dest(folders.dist))
        .pipe($.uglify({ preserveComments: 'some' }))
        .pipe($.rename(pkg.name + '.min.js'))
        .pipe(gulp.dest(folders.dist))
        .pipe($.size());
});

gulp.task('bump', function () {
    gulp.src(['./bower.json', './package.json'])
        .pipe($.bump({ indent: 4 }))
        .pipe(gulp.dest('./'));
});

gulp.task('clean', function () {
    return gulp.src([folders.tmp, folders.dist], { read: false })
        .pipe($.clean());
});

gulp.task('build', ['clean', 'test', 'scripts']);

gulp.task('default', ['build']);

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(serveStatic(folders.src))
        .use(serveStatic(folders.app))
        .use(serveStatic(folders.tmp))
        .use(serveIndex(folders.app));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('serve', ['connect', 'sass'], function () {
    require('opn')('http://localhost:9000');
});

gulp.task('watch', ['serve'], function () {
    var server = $.livereload();

    // watch for changes

    gulp.watch(files.app.watch).on('change', function (file) {
        server.changed(file.path);
    });
    gulp.watch(files.src.scripts).on('change', function (file) {
        server.changed(file.path);
    });

    gulp.watch(files.app.sass, ['sass']);
    gulp.watch(files.src.scripts, ['scripts']);
});
