'use strict';

import { readFileSync } from 'node:fs';
import { Transform } from 'node:stream';

import gulp from 'gulp';
import sassCompiler from 'sass';
import gulpSass from 'gulp-sass';
import pump from 'pump';

import jshint from 'gulp-jshint';
import sourcemaps from 'gulp-sourcemaps';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import autoprefixer from 'gulp-autoprefixer';
import cleanCss from 'gulp-clean-css';
import iconfont from 'gulp-iconfont';
import stylelint from 'stylelint';
import _ from 'lodash';

const sass = gulpSass(sassCompiler);
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));

// Renders a lodash template file, matching gulp-consolidate's ('lodash', locals) behaviour.
function renderTemplate(locals) {
  return new Transform({
    objectMode: true,
    transform(file, encoding, cb) {
      if (file.isBuffer()) {
        const rendered = _.template(file.contents.toString())(locals).replace(/\n$/, '');
        file.contents = Buffer.from(rendered);
      }
      cb(null, file);
    }
  });
}

// Lints and auto-fixes (property ordering, formatting) the compiled CSS,
// replacing the old gulp-csslint + gulp-csscomb pair.
function lintAndFixCss() {
  return new Transform({
    objectMode: true,
    transform(file, encoding, cb) {
      if (!file.isBuffer()) {
        return cb(null, file);
      }

      stylelint.lint({
        code: file.contents.toString(),
        codeFilename: file.path,
        fix: true
      }).then((result) => {
        result.results.forEach((lintResult) => {
          lintResult.warnings.forEach((warning) => {
            console.log(`stylelint: ${file.relative}:${warning.line}:${warning.column} ${warning.text}`);
          });
        });
        file.contents = Buffer.from(result.code);
        cb(null, file);
      }, cb);
    }
  });
}

var scripts = {
      name: 'jquery.contextMenu.js',
      min: 'jquery.contextMenu.min.js',
      all: [
        'gulpfile.mjs',
        'src/jquery.contextMenu.js',
        'dist/jquery.contextMenu.js'
      ],
      main: 'dist/jquery.contextMenu.js',
      src: [
          'src/jquery.contextMenu.js'
      ],
      dest: 'dist',
      libs: [
      ]
    };
var styles = {
      name: 'jquery.contextMenu.css',
      min: 'jquery.contextMenu.min.css',
      all: [
        'src/sass/**/*.scss'
      ],
      main: 'dist/jquery.contextMenu.css',
      src: 'src/sass/jquery.contextMenu.scss',
      dest: 'dist'
    };
var icons = {
    src: 'src/icons/*.svg',
    templateFileFont: 'src/sass/icons/_variables.scss.tpl',
    templateFileIconClasses: 'src/sass/icons/_icon_classes.scss.tpl',
    fontOutputPath: 'dist/font',
    scssOutputPath: 'src/sass/icons/'
};
var replacement = {
      regexp: /@\w+/g,
      filter: function (placeholder) {
        switch (placeholder) {
          case '@VERSION':
            placeholder = pkg.version;
            break;

          case '@YEAR':
            placeholder = (new Date()).getFullYear();
            break;

          case '@DATE':
            placeholder = (new Date()).toISOString();
            break;
        }

        return placeholder;
      }
    };

gulp.task('jshint', function (cb) {
  pump([
      gulp.src(scripts.src),
      jshint('src/.jshintrc'),
      jshint.reporter('default')
  ],cb);
});

gulp.task('jsdist', function (cb) {
    pump([
        gulp.src(scripts.src),
        sourcemaps.init(),
        replace(replacement.regexp, replacement.filter),
        gulp.dest(scripts.dest),
        rename(scripts.min),
        uglify({ compress: { arrows: false } }),
        sourcemaps.write('.'),
        gulp.dest(scripts.dest)
    ], cb);
});


gulp.task('jslibs', function (cb){
    pump([
        gulp.src(scripts.libs),
        rename({prefix: 'jquery.ui.'}),
        gulp.dest('src'),
        gulp.dest('dist'),
        rename({extname: '.min.js'}),
        gulp.dest('dist'),
        uglify({ compress: { arrows: false } }),
        sourcemaps.write('.'),
        gulp.dest(scripts.dest)
    ], cb);
});

gulp.task('css', function (cb) {
    return pump([
        gulp.src(styles.src),
        sass(),
        sourcemaps.init(),
        replace(replacement.regexp, replacement.filter),
        autoprefixer(),
    lintAndFixCss(),
    rename(styles.name),
    gulp.dest(styles.dest),
    rename(styles.min),
    cleanCss(),
    sourcemaps.write('.'),
    gulp.dest(styles.dest)
        ], cb);
});

gulp.task('build-icons', function (done) {
    return iconfont(icons.src, {
            fontName: 'context-menu-icons',
            fontHeight: 1024,
            descent: 64,
            normalize: true,
            appendCodepoints: false,
            startCodepoint: 0xE001,
			formats: ['ttf', 'eot', 'woff', 'woff2']
        })
        .on('glyphs', function (glyphs) {
            var options = {
                glyphs: glyphs,
                className: 'context-menu-icon',
                mixinName: 'context-menu-item-icon'
            };

            gulp.src(icons.templateFileFont)
                .pipe(renderTemplate(options))
                .pipe(rename({basename: '_variables', extname: '.scss'}))
                .pipe(gulp.dest(icons.scssOutputPath));

            gulp.src(icons.templateFileIconClasses)
                .pipe(renderTemplate(options))
                .pipe(rename('_icons.scss'))
                .pipe(gulp.dest('src/sass')); // set path to export your sample HTML
        })
        .pipe(gulp.dest(icons.fontOutputPath));

});

gulp.task('js', gulp.series('jshint', 'jsdist', (done) => {
    done();
}));


gulp.task('watch', gulp.parallel('js', 'css', function (done) {
    gulp.watch(scripts.src,gulp.series('js'));
    gulp.watch(styles.all, gulp.series('css'));
    done();
}));
gulp.task('build', gulp.series('build-icons', 'css', 'js', (done) => {
    done();
}));

gulp.task('default', gulp.series('watch', (done) => {
    done();
}));
