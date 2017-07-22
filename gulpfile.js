var gulp = require("gulp"),
	rename = require("gulp-rename"),
	gutil = require("gulp-util"),
	cleanCSS = require("gulp-clean-css"),
	uglify = require("gulp-uglify"),
	plumber = require("gulp-plumber");

var plumberErrorHandler = {
	errorHandler: function(){
		gutil.beep();
	}
}
/*MODIFYING CSS TASK*/
gulp.task("gen-css",function(){
	return gulp.src(paths.css)
		.pipe(plumber(plumberErrorHandler))
		.pipe(cleanCSS())
		.pipe(gulp.dest("assets/css"))
})
/*MODIFYING JS TASK*/
gulp.task("gen-js", function(){
	return gulp.src(paths.js)
		.pipe(plumber(plumberErrorHandler))
		.pipe(uglify().on("error", function(errorLog){console.log(errorLog)}))
		.pipe(rename({suffix:".min"}))
		.pipe(gulp.dest("assets/js"));
});
/*Build proyect for first time*/
gulp.task("firstBuild", ["gen-css", "gen-js"], function(){
	gulp.watch(paths.js, ["gen-js"]);
	gulp.watch(paths.css, ["gen-css"]);;
});
/*DEFAULT TASK*/
gulp.task("default", function(){
	gulp.start("firstBuild");
})