'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var icons = {
    src: 'src/icons/*.svg',
    templateFileFont: 'src/sass/icons/_variables.scss.tpl',
    templateFileIconClasses: 'src/sass/icons/_icon_classes.scss.tpl',
    fontOutputPath: 'dist/font',
    scssOutputPath: 'src/sass/icons/'
};

gulp.task('build-icons', function () {
    var iconfont = require('gulp-iconfont');
    var consolidate = require('gulp-consolidate');

    gulp.src(icons.src)
        .pipe(iconfont({
            fontName: 'context-menu-icons',
            fontHeight: 1024,
            descent: 64,
            normalize: true,
            appendCodepoints: false,
            startCodepoint: 0xE001,
            formats: ['ttf', 'eot', 'woff', 'woff2']
        }))
        .on('glyphs', function (glyphs) {
            var options = {
                glyphs: glyphs,
                className: 'context-menu-icon',
                mixinName: 'context-menu-item-icon'
            };

            gulp.src(icons.templateFileFont)
                .pipe(consolidate('lodash', options))
                .pipe(plugins.rename({basename: '_variables', extname: '.scss'}))
                .pipe(gulp.dest(icons.scssOutputPath));

            gulp.src(icons.templateFileIconClasses)
                .pipe(consolidate('lodash', options))
                .pipe(plugins.rename('_icons.scss'))
                .pipe(gulp.dest('src/sass')); // set path to export your sample HTML
        })
        .pipe(gulp.dest(icons.fontOutputPath));
});

gulp.task('build', ['build-icons']);

gulp.task('default', ['build']);
