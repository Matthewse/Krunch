const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const postCSS = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const minify = require('gulp-csso');
const rename = require('gulp-rename');
const del = require('del');
const browserSync = require('browser-sync').create();

gulp.task('style', function () {
   return gulp.src('src/sass/style.scss')
      .pipe(plumber())
      .pipe(sass())
      .pipe(postCSS([
         autoprefixer()
      ]))
      .pipe(gulp.dest('build/css'))
      .pipe(browserSync.stream())
      .pipe(minify())
      .pipe(rename('style.min.css'))
      .pipe(gulp.dest('build/css'));
});

gulp.task('copy', function () {
   return gulp.src([
      'src/fonts/**',
      'src/img/**'
   ], {
      base: 'src'
   })
      .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
   return del('build/*');
})

gulp.task('watch', function () {
   browserSync.init({
      server: {
         baseDir: './'
      }
   });

   gulp.watch('./src/sass/**/*.scss', gulp.series('style'));
   gulp.watch('./*.html').on('change', browserSync.reload);
});

gulp.task('build', gulp.series('clean', 'copy', 'style', 'watch'));