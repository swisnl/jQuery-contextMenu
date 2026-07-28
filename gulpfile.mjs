'use strict';

import { readFileSync } from 'node:fs';
import { Transform } from 'node:stream';

import gulp from 'gulp';
import sassCompiler from 'sass';
import gulpSass from 'gulp-sass';
import pump from 'pump';

import eslint from 'gulp-eslint-new';
import sourcemaps from 'gulp-sourcemaps';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import { minify } from 'terser';
import autoprefixer from 'gulp-autoprefixer';
import postcss from 'postcss';
import cssnano from 'cssnano';
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

// Minifies JS, replacing gulp-uglify.
function minifyJs() {
  return new Transform({
    objectMode: true,
    transform(file, encoding, cb) {
      if (!file.isBuffer()) {
        return cb(null, file);
      }

      const hasSourceMap = !!file.sourceMap;

      minify({ [file.relative]: file.contents.toString() }, {
        compress: { arrows: false },
        sourceMap: hasSourceMap ? { filename: file.relative, asObject: true } : false
      }).then((result) => {
        file.contents = Buffer.from(result.code);
        if (hasSourceMap && result.map) {
          file.sourceMap = result.map;
        }
        cb(null, file);
      }, cb);
    }
  });
}

// Minifies CSS, replacing gulp-clean-css.
function minifyCss() {
  return new Transform({
    objectMode: true,
    transform(file, encoding, cb) {
      if (!file.isBuffer()) {
        return cb(null, file);
      }

      const hasSourceMap = !!file.sourceMap;

      postcss([cssnano]).process(file.contents.toString(), {
        from: file.path,
        to: file.path,
        map: hasSourceMap ? { prev: file.sourceMap, inline: false, annotation: false } : false
      }).then((result) => {
        file.contents = Buffer.from(result.css);
        if (hasSourceMap && result.map) {
          const map = result.map.toJSON();
          map.file = file.relative;
          file.sourceMap = map;
        }
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

gulp.task('lint', function (cb) {
  pump([
      gulp.src(scripts.src),
      eslint(),
      eslint.format()
  ],cb);
});

gulp.task('jsdist', function (cb) {
    pump([
        gulp.src(scripts.src),
        sourcemaps.init(),
        replace(replacement.regexp, replacement.filter),
        gulp.dest(scripts.dest),
        rename(scripts.min),
        minifyJs(),
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
        minifyJs(),
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
    minifyCss(),
    sourcemaps.write('.'),
    gulp.dest(styles.dest)
        ], cb);
});

gulp.task('build-icons', function () {
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

gulp.task('js', gulp.series('lint', 'jsdist', (done) => {
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
