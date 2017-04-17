const gulp     = require('gulp');
const ts       = require('gulp-typescript');
const nodemon  = require('nodemon');
const del      = require('del');
const jasmine  = require('gulp-jasmine');

const JSON_FILES = ['src/*.json', 'src/**/*.json'];

// pull in the project TypeScript config
const tsProjectBuild = ts.createProject('tsconfig.json');
const tsProjectTest = ts.createProject('tsconfig-test.json');


gulp.task('scripts',['clean:dist'], () => {
  const tsResult = tsProjectBuild.src()
      .pipe(tsProjectBuild());
return tsResult.js.pipe(gulp.dest('../functions/dist'));
});

gulp.task('scripts-tests',['clean:test'], () => {
  const tsResult = tsProjectTest.src()
      .pipe(tsProjectTest());
  return tsResult.js.pipe(gulp.dest('spec/build'));
});

gulp.task('assets', ['assets-tests'], () => {
  return gulp.src(JSON_FILES)
      .pipe(gulp.dest('../functions/dist'));
});
gulp.task('assets-tests', () => {
  return gulp.src(JSON_FILES)
      .pipe(gulp.dest('spec/build'));
});

gulp.task('clean:dist', function() {
  return del.sync('../functions/dist/*',{force:true});
})
gulp.task('clean:test', function() {
  return del.sync('spec/build/*');
})

gulp.task('watch', ['scripts','scripts-tests'], () => {
  gulp.watch('src/**/*.ts', ['scripts','scripts-tests','jasmine']);
});

gulp.task('jasmine', ['scripts-tests'], () => {
  gulp.src('spec/build/**/*.spec.js').pipe(jasmine())
  // gulp-jasmine works on filepaths so you can't have any plugins before it
});



gulp.task('default', ['watch', 'assets','jasmine']);