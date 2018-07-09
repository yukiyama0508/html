var gulp = require("gulp");

var ejs = require('gulp-ejs'),
    sass = require("gulp-sass"),
    notify = require("gulp-notify"),
    plumber = require("gulp-plumber"),
    pleeease = require("gulp-pleeease"),
    browser = require('browser-sync'),
    // imagemin = require('gulp-imagemin'),
    cssmin = require('gulp-cssmin'),
    changed  = require('gulp-changed'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    csscomb = require('gulp-csscomb'),
    prettify = require('gulp-prettify'),
    cache = require('gulp-cached'),
    fs = require( 'fs' );



var DEV = "app/dev/",
    PUBLIC = "app/public/";



//ejs
gulp.task("ejs", function() {
  var json = JSON.parse(fs.readFileSync(DEV + "/ejs/_pages.json"));

    gulp.src(
        [DEV + "/ejs/**/*.ejs",'!' + DEV + "/ejs/**/_*.ejs"]
    )
        .pipe(ejs({json},{},{"ext":".html"}))
        .pipe(prettify())
        .pipe(gulp.dest(PUBLIC))
        .pipe(browser.reload({stream:true}));
});


//sass
gulp.task('sass',function(){
  return gulp.src(DEV + 'sass/**/*.scss')
  .pipe(plumber({
    errorHandler: notify.onError('Error: <%= error.message %>')
  }))
  .pipe(sass({outputStyle: 'expanded'}))
  .pipe(pleeease({
    fallback:{
                autoprefixer: ["last 2 version", "ie 10"]
    },
    minifier: false
  }))
  .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
  .pipe(cache('css-cache'))
  .pipe(csscomb())
  .pipe(cssmin())
  .pipe(gulp.dest(PUBLIC + "css/"))
  .pipe(browser.reload({stream:true}));

});

//jsmin
gulp.task("js", function() {
    return gulp.src(DEV + "/js/**/*.js")
    .pipe(plumber({
    errorHandler: notify.onError('Error: <%= error.message %>')
  }))
    .pipe(changed(DEV + "/js/**/*.js"))
    .pipe(uglify())
    .pipe(cache('js-cache'))
    .pipe(gulp.dest(PUBLIC + "/js"))
    .pipe(browser.reload({stream:true}));

});

//browser sync
gulp.task("server", function() {
    browser({
        server: {
            baseDir: PUBLIC
        },
        port: 5000
    });
});

//images
gulp.task('images',function(){
      gulp.src(DEV + 'ejs/img/**/*.+(jpg|jpeg|png|gif|svg)')
//    .pipe(imagemin())
    .pipe(gulp.dest(PUBLIC+'img'))
});

gulp.task('default',['sass','js','ejs','server','images'],function(){
  gulp.watch(DEV + "sass/**/*.scss",["sass"]);
  gulp.watch(DEV + "js/**/*.js",["js"]);
  gulp.watch(DEV + "ejs/**/*.ejs",["ejs"]);
  gulp.watch(DEV + "ejs/img/**/*.+(jpg|jpeg|png|gif|svg)",["images"]);
});
