const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const postCSS = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const minify = require('gulp-csso');
const rename = require('gulp-rename');
const del = require('del');
const browserSync = require('browser-sync').create();
const deploy = require('gulp-gh-pages');

gulp.task('style', function () {
   return gulp.src('src/sass/style.scss')
      .pipe(plumber())
      .pipe(sass())
      .pipe(postCSS([
         autoprefixer()
      ]))
      .pipe(gulp.dest('src/css'))
      .pipe(browserSync.stream())
      .pipe(minify())
      .pipe(rename('style.min.css'))
      .pipe(gulp.dest('src/css'));
});

gulp.task('copy', function () {
   return gulp.src([
      'src/css/**',
      'src/fonts/**',
      'src/img/**',
      'src/*.html'
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
         baseDir: './src'
      }
   });

   gulp.watch('./src/sass/**/*.scss', gulp.series('style'));
   gulp.watch('./src/*.html').on('change', browserSync.reload);
});

gulp.task('deploy', function () {
   return gulp.src("./build/**/*")
     .pipe(deploy())
 });

gulp.task('dev', gulp.series('style', 'watch'));
gulp.task('build', gulp.series('clean', 'copy'));