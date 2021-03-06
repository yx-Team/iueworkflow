const gulp = require('gulp')

// 任务条件
const gulpSequence = require('gulp-sequence') // 任务执行序列化插件
const del = require('del') // 删除插件
const change = require('gulp-changed') // 只修改改动的文件
const gulpif = require('gulp-if') // if条件
const plumber = require('gulp-plumber') // 输出错误
const notify = require('gulp-notify') // 任务通知
// HTML
const useref = require('gulp-useref') // 页面中合并资源
const htmlminify = require('gulp-html-minify') // html压缩
// IMAGE
const imagemin = require('gulp-imagemin') // 图片压缩
const base64 = require('gulp-base64') // 图片转base64
// CSS
const less = require('gulp-less')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const px2rem = require('gulp-ipx2rem')
const cleanCss = require('gulp-clean-css') // css压缩
// JS
const babel = require('gulp-babel')
const beautify = require('gulp-beautify')
const uglify = require('gulp-uglify')

// 浏览器异步刷新
var browserSync = require('browser-sync').create()
var reload = browserSync.reload
// build得一些插件
const zip = require('gulp-zip')

const paths = process.argv[3].replace(/--path=/g, '')
const config = require(paths + '/config.json')

gulp.task('test', function () {
  console.log(process.argv)
})
// 开发环境
gulp.task('dev', ['init'], function () {
  browserSync.init({
    server: {
      // 指定目录 root
      baseDir: paths,
      // 默认跳转的地址
      // index:'html/index.html'
      // 打开目录
      directory: true
    },
    open: true,
    port: 8080
  })
  gulp.watch(paths + '/' + config.dev.html + '**/*.html', ['html'])
  gulp.watch(paths + '/' + config.dev.less + '*.less', ['less'])
  gulp.watch(paths + '/' + config.dev.css + '*.css', ['css'])
  gulp.watch(paths + '/' + config.dev.js + '**/*.js', ['js', 'babel'])
  gulp.watch(paths + '/' + config.dev.images + '*', ['img'])
})
gulp.task('closeServer', function () {
  var exit = browserSync.exit()
  console.log(exit)
})
// 开始运行时，删除build目录，并将资源处理并复制到build
gulp.task(
  'init',
  gulpSequence('del', 'less', 'css', 'js', 'babel', 'img', 'html')
)
// 生产环境
gulp.task(
  'build',
  gulpSequence(
    'del',
    'less',
    'css',
    'js',
    'babel:build',
    'js:build',
    'img',
    'html',
    'css:build',
    'html:build'
  )
)

gulp.task('html', function () {
  return gulp
    .src(paths + '/' + config.dev.html + '**/*.html')
    .pipe(change(paths + '/' + config.build.html))
    .pipe(gulp.dest(paths + '/' + config.build.html))
    .pipe(
      reload({
        stream: true
      })
    )
})

gulp.task('less', function () {
  return gulp
    .src(paths + '/' + config.dev.less + '*.less')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error)
        this.emit('end')
      }
    }))
    .pipe(change(paths + '/' + config.dev.css))
    .pipe(less())
    .pipe(gulp.dest(paths + '/' + config.dev.css))
    .pipe(
      reload({
        stream: true
      })
    )
})

gulp.task('css', function () {
  return gulp
    .src(paths + '/' + config.dev.css + '*.css')
    .pipe(plumber())
    .pipe(change(paths + '/' + config.build.css))
    .pipe(postcss([autoprefixer(config.autoprefixer.options)]))
    .pipe(gulp.dest(paths + '/' + config.dev.css))
    .pipe(gulpif(config.px2rem.open, px2rem(config.px2rem.optipng)))
    .pipe(gulp.dest(paths + '/' + config.dev.css))
    .pipe(gulp.dest(paths + '/' + config.build.css))
    .pipe(
      reload({
        stream: true
      })
    )
})

gulp.task('js', function () {
  return gulp
    .src(paths + '/' + config.dev.js + '**/*.js')
    .pipe(plumber())
    .pipe(change(paths + '/' + config.build.js))
    .pipe(gulp.dest(paths + '/' + config.build.js))
    .pipe(
      reload({
        stream: true
      })
    )
})

gulp.task('babel', function () {
  return gulp
    .src([config.dev.js + '**/*.js', ...config.babel.filter])
    .pipe(change(paths + '/' + config.build.js))
    .pipe(
      plumber({
        errorHandler: function (error) {
          console.log(error)
          this.emit('end')
        }
      })
    )
    .pipe(babel(config.babel.options))
    .pipe(gulp.dest(paths + '/' + config.build.js))
    .pipe(
      reload({
        stream: true
      })
    )
})
gulp.task('img', function () {
  return gulp
    .src(paths + '/' + config.dev.images + '*')
    .pipe(change(paths + '/' + config.build.images))
    .pipe(gulp.dest(paths + '/' + config.build.images))
    .pipe(
      reload({
        stream: true
      })
    )
})
gulp.task('del', function () {
  return del([config.build.baseDir]).then(paths => {
    console.log('删除完成')
  })
})
/* -----------------------------build--------------------------------- */

gulp.task('html:build', function () {
  return gulp
    .src(paths + '/' + config.build.html + '**/*.html')
    .pipe(useref())
    .pipe(gulpif(config.htmlminify.compress, htmlminify()))
    .pipe(gulp.dest(paths + '/' + config.build.html))
    .pipe(notify({
      title: 'notice',
      message: 'build success'
    }))
})
gulp.task('img:build', function () {
  return gulp
    .src(paths + '/' + config.dev.images + '*')
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 })
      ])
    )
    .pipe(gulp.dest(paths + '/' + config.build.images))
})
// css压缩
gulp.task('css:build', function () {
  return gulp
    .src(paths + '/' + config.build.css + '*.css')
    .pipe(plumber())
    .pipe(base64(config.cleanCss.base64))
    .pipe(gulpif(config.cleanCss.compress, cleanCss()))
    .pipe(gulp.dest(paths + '/' + config.build.css))
})
// js压缩美化
gulp.task('js:build', function () {
  return gulp
    .src([config.build.js + '**/*.js', ...config.uglify.filter])
    .pipe(
      plumber({
        errorHandler: function (error) {
          console.log(error)
          this.emit('end')
        }
      })
    )
    .pipe(gulpif(config.uglify.compress, uglify(), beautify()))
    .pipe(gulp.dest(paths + '/' + config.build.js))
})
// babel
gulp.task('babel:build', function () {
  return gulp
    .src([config.dev.js + '**/*.js', ...config.babel.filter])
    .pipe(
      plumber({
        errorHandler: function (error) {
          console.log(error)
          this.emit('end')
        }
      })
    )
    .pipe(babel(config.babel.options))
    .pipe(gulp.dest(paths + '/' + config.build.js))
})

// 打包zip
gulp.task('zip', function () {
  return gulp
    .src(paths + '/' + config.build.baseDir + '**')
    .pipe(zip(config.zip.name))
    .pipe(notify({
      title: 'notice',
      message: 'zip sucess'
    }))
    .pipe(gulp.dest(paths))
})
