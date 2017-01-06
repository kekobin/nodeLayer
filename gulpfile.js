require('shelljs/global');
var argv = process.argv;
var projectNameFromArgv = argv[4];

//当为开发环境时需要做些配置
if(argv[2] == 'serve') {
    require('./setting/setting')(projectNameFromArgv);
}

var gulp = require('gulp');  
var nodemon = require('gulp-nodemon');  
var sass = require('gulp-ruby-sass');  
var autoprefixer = require('gulp-autoprefixer');  
var livereload = require('gulp-livereload');  
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var imagemin = require('gulp-imagemin');
var del = require('del');
var replace = require('gulp-replace');
var md5 = require("gulp-md5-plus");
var copy = require('gulp-copy');
var sequence = require('gulp-sequence');

var path = require('path');

var projectConfig = require('./config/projectConfig');
var baseConfig = require('./config/baseConfig');
var projectName = projectNameFromArgv || projectConfig.currentProject;
var CDN_PATH = baseConfig.CDN_PATH;

var filePath = {
	srcName: 'src',
	destName: 'dest',
	srcSass: 'public/' + projectName + '/sass/*.scss',
	srcJS: 'public/' + projectName + '/js/*.js',
	srcEjs: 'views/' + projectName + 'View/*.ejs',
	srcTpl: 'views/' + projectName + 'View/template/*.ejs',
	srcImg: 'public/' + projectName + '/img/*',
	srcCss: 'public/' + projectName + '/css/*.css',
	srcCssDir: 'public/' + projectName + '/css',
	destCss: 'dest/' + projectName + '/css',
	destJS: 'dest/' + projectName + '/js',
	destImg: 'dest/' + projectName + '/img',
	configPath: 'config/projectConfig.js'
};

var md5TargetPath = filePath.destName + '/' + projectName + 'View/**/*.ejs';

gulp.task('styles', function() {  
  return sass(filePath.srcSass)
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest(filePath.srcCssDir))
    .pipe(livereload());
});

gulp.task('scripts', function() {  
  return gulp.src(filePath.srcJS)
    .pipe(livereload());
});

gulp.task('ejs',function(){  
    return gulp.src(filePath.srcEjs)
    .pipe(livereload());
});

gulp.task('watch', function() {  
    livereload.listen();
    gulp.watch(filePath.srcSass, ['styles']);
    gulp.watch(filePath.srcJS, ['scripts']);
    gulp.watch(filePath.srcEjs, ['ejs']);
});

gulp.task('server',function(){  
    nodemon({
        'script': './bin/www',
        'ignore': filePath.srcJS
    });
});

//将页面中的相对路径替换为绝对路径
gulp.task('replace', function(){
    return gulp.src([path.join(__dirname, 'views/' + projectName + 'View/**/*.ejs')])
    .pipe(replace(/\.\.\/\.\.\//g, CDN_PATH))
    .pipe(gulp.dest(filePath.destName + '/' + projectName + 'View/'));
});

gulp.task('build_js', function () {
  	return gulp.src(filePath.srcJS)
  		.pipe(md5(6,md5TargetPath))
        .pipe(uglify())
        .pipe(gulp.dest(filePath.destJS))
});

gulp.task('build_css', function () {
    return gulp.src(filePath.srcCss)
    	.pipe(md5(6,md5TargetPath))
        .pipe(cssmin())
        .pipe(gulp.dest(filePath.destCss));
});

gulp.task('build_img', function () {
    return gulp.src(filePath.srcImg)
    	.pipe(md5(6,md5TargetPath))
        .pipe(imagemin())
        .pipe(gulp.dest(filePath.destImg))
});

gulp.task('copy', function () {
    return gulp.src([filePath.configPath])
        .pipe(copy(filePath.destName + '/' + projectName +  'View/', { prefix: 1 }));
});

gulp.task('clean', function () {
    del.sync([filePath.destName + '/**']);
});

gulp.task('serve', ['server','watch']);  
// gulp.task('build', ['clean','replace','build_js','build_css','build_img','copy']);  

gulp.task('build', function(cb) {
    sequence(
        ['clean','replace'],
        ['build_js','build_css','build_img','copy'],
        cb);
});  
