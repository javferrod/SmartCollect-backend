'use strict';

const gulp = require('gulp'),
    ts = require('gulp-typescript'),
    maps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    pump = require('pump'),
    uglify = require('gulp-uglify');

const PROJECT = ts.createProject('./tsconfig.json'),
    TEST_PROJECT = ts.createProject('./tsconfig.json'),
    DEV_FILES = ['**/*.ts'],
    SRC_FILES = ['**/*.ts', '!./lib/**/*.spec.ts'],
    TEST_FILES = ['**/*.spec.ts'],
    DEV_DEST = './build/',
    PROD_DEST = './dist/';

function makeCompilationPipe(dev) {
    let pipe = [];
    pipe.push(gulp.src(SRC_FILES));
    handlePreCompilation(pipe, dev);
    pipe.push(PROJECT());
    handlePostCompilation(pipe, dev);
    return pipe;
}

function handlePreCompilation(pipe, dev) {
    if (dev)
        pipe.push(maps.init());
}

function handlePostCompilation(pipe, dev) {
    if (dev)
        handlePostCompilationDevelopment(pipe);
    else
        handlePostCompilationProduction(pipe);
}

function handlePostCompilationDevelopment(pipe) {
    pipe.push(maps.write());
    pipe.push(gulp.dest(DEV_DEST));
}

function handlePostCompilationProduction(pipe) {
    pipe.push(concat('index.js'));
    pipe.push(uglify());
    pipe.push(gulp.dest(PROD_DEST));
}

function build(endCallback, options) {
    let pipe = makeCompilationPipe(options);
    pump(pipe, endCallback);
}

gulp.task('build:code', (cb) => {
    build(cb, {devMode: true});
});

gulp.task('build:test', (cb) => {
    let pipe = [
        gulp.src(TEST_FILES),
        maps.init(),
        TEST_PROJECT(),
        concat('project.spec.js'),
        maps.write(),
        gulp.dest(DEV_DEST)
    ];
pump(pipe, cb);
});

gulp.task('build:dev', ['build:code', 'build:test']);

gulp.task('build:prod', (cb) => {
    build(cb);
});

gulp.task('watch', ['build:dev'], () => {
    watch(DEV_FILES, () => { gulp.start('build:dev') });
});

