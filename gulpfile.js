"use strict";
let gulp = require("gulp"),
	rename = require("gulp-rename"),
	gutil = require("gulp-util"),
	cleanCSS = require("gulp-clean-css"),
	uglify = require("gulp-uglify"),
	plumber = require("gulp-plumber"),
	babel = require("gulp-babel");

let plumberErrorHandler = {
	errorHandler: function(err){
		console.log(err);
		gutil.beep();
	}
}

let paths = {
	css : ["assets/css/*","!assets/css/*.min.css"],
	js : ["assets/js/*", "!assets/js/*.min.js"]
}
/*MODIFYING CSS TASK*/
gulp.task("gen-css",function(){
	return gulp.src(paths.css)
		.pipe(plumber(plumberErrorHandler))
		.pipe(rename({suffix:".min"}))
		.pipe(cleanCSS())
		.pipe(gulp.dest("assets/css/"))
})
/*MODIFYING JS TASK*/
gulp.task("gen-js", function(){
	return gulp.src(paths.js)
		.pipe(plumber(plumberErrorHandler))
		.pipe(babel({presets: ['es2015']}))
		.pipe(uglify())
		.pipe(rename({suffix:".min"}))
		.pipe(gulp.dest("assets/js/"));
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