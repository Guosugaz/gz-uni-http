/*
 * @Description: 
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-09-01 15:54:34
 * @LastEditTime: 2022-09-01 15:56:55
 */
const { src, dest, series, task } = require("gulp");
const terser = require("gulp-terser");
const gulpClean = require("gulp-clean");

function clean() {
  return src("dist").pipe(gulpClean());
}

function terserJs() {
  return src("./dist/**/*.js").pipe(terser()).pipe(dest("./dist"));
}

task("clean", series(clean));
task("terser", series(terserJs));
