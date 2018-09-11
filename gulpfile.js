var del = require("del");
const { series, src, dest, parallel, watch } = require("gulp");
var streamSeries = require("stream-series");
var inject = require("gulp-inject");
var _ = require("lodash");
var path = require("path");
var merge = require("merge-stream");
var debug = require("gulp-debug-streams");
var order = require("gulp-order");
var webserver = require("gulp-webserver");
var htmlclean = require("gulp-htmlclean");
var cleanCSS = require("gulp-clean-css");
var concat = require("gulp-concat-util");
var uglify = require("gulp-uglify");
var concatCss = require("gulp-concat-css");

exports.clean = clean;

const build = series(parallel(html, css, js, images, tmp_fonts), injectFiles);
exports.build = build;
exports.default = series(clean, build);
var serve = series(clean, build, serveTmp);
exports.serve = serve;
exports.watch = series(serve, watchTmp);

const dist = series(
  parallel(dist_html, dist_css, dist_js, dist_images, dist_fonts),
  dist_injectFiles
);
exports.publish = series(clean, dist);
var dist_serve = series(clean, dist, serveDist);
exports.serveDist = dist_serve;
exports.watchDist = series(dist_serve, watchDist);

var paths = {
  src: "src/**/*",
  srcHTML: "src/**/*.html",
  srcCSS: [
    "node_modules/bootstrap/dist/css/bootstrap.css",
    "node_modules/font-awesome/css/font-awesome.css",
    "src/fonts/themify/themify-icons.css",
    "node_modules/animate.css/animate.css",
    "node_modules/hamburgers/dist/hamburgers.css",
    "node_modules/animsition/dist/css/animsition.css",
    "node_modules/select2/dist/css/select2.css",
    "node_modules/slick-carousel/slick/slick.css",
    "node_modules/lightbox2/dist/css/lightbox.css",
    "src/css/**/*.css"
  ],
  srcVendorJS: [
    "node_modules/jquery/dist/jquery.js",
    "node_modules/animsition/dist/js/animsition.js",
    "node_modules/popper.js/dist/umd/popper.js",
    "node_modules/bootstrap/dist/js/bootstrap.js",
    "node_modules/select2/dist/js/select2.js",
    "node_modules/moment/moment.js",
    "node_modules/daterangepicker/daterangepicker.js",
    "node_modules/slick-carousel/slick/slick.js",
    "node_modules/isotope-layout/dist/isotope.pkgd.js",
    "src/vendor/parallax100/parallax100.js",
    "src/vendor/countdowntime/countdowntime.js",
    "node_modules/lightbox2/dist/js/lightbox.js"
  ],

  srcJS: ["src/js/**/*.js", "!**/map-custom.js"],
  tmp: "tmp",
  tmpIndex: "tmp/index.html",
  tmpCSS: "tmp/**/*.css",
  tmpJS: "tmp/**/*.js",
  dist: "dist",
  distHtml: "dist/*.html",
  distCSS: "dist/**/*.css",
  distJS: "dist/**/*.js"
};

function html() {
  return src(paths.srcHTML).pipe(dest(paths.tmp));
}
function dist_html() {
  return src(paths.srcHTML)
    .pipe(htmlclean())
    .pipe(dest(paths.dist));
}

function css() {
  return src(paths.srcCSS).pipe(dest(paths.tmp + "/css/"));
}

function dist_css() {
  return src(paths.srcCSS)
    .pipe(
      order(["!**/main*", "**/main*"]) // main.css needs to come last to override vendor CSS
    )
    .pipe(concat.header("/* file: <%= file.path %> */\n"))
    .pipe(concatCss("style.min.css", { rebaseUrls: false }))
    .pipe(cleanCSS())
    .pipe(dest(paths.dist + "/css/"));
}

function js() {
  var vendorJs = src(paths.srcVendorJS).pipe(dest(paths.tmp + "/js/vendor"));
  var myJs = src(paths.srcJS).pipe(dest(paths.tmp + "/js/"));
  return merge(vendorJs, myJs);
}

function dist_js() {
  var vendorJs = src(paths.srcVendorJS)
    .pipe(
      // jQuery needs to come first, datetimepicker depends on moment and the rest of the vendor JS should come before our own scripts
      order(["**/jquery*", "**/moment.js", "vendor/*.js", "/**/*"])
    )
    .pipe(concat("vendor.min.js"))
    .pipe(uglify())
    .pipe(dest(paths.dist + "/js/vendor"));
  var myJs = src(paths.srcJS)
    .pipe(concat("scripts.min.js"))
    .pipe(uglify())
    .pipe(dest(paths.dist + "/js/"));
  return merge(vendorJs, myJs);
}

function images() {
  return src(["src/images/**/*", "node_modules/lightbox2/dist/images/*"]).pipe(
    dest(paths.tmp + "/images")
  );
}

function dist_images() {
  return src(["src/images/**/*", "node_modules/lightbox2/dist/images/*"]).pipe(
    dest(paths.dist + "/images")
  );
}

function tmp_fonts() {
  return fonts(paths.tmp);
}

function dist_fonts() {
  return fonts(paths.dist);
}

function fonts(destination) {
  var fonts = src(["node_modules/font-awesome/fonts/*.*"]).pipe(
    dest(destination + "/fonts/")
  );
  var themify = src(["src/fonts/themify/fonts/*"]).pipe(
    dest(destination + "/css/fonts/")
  );
  var googleFonts = src([
    "src/fonts/courgette/*.ttf",
    "src/fonts/montserrat/*.ttf",
    "src/fonts/notosans/*.ttf",
    "src/fonts/poppins/*.ttf"
  ]).pipe(
    dest(function(file) {
      // Extract foldername from path and use that in destination
      var folders = file.path.split(path.sep);
      var foldername = _.takeRight(folders, 2)[0];
      return destination + "/fonts/" + foldername;
    })
  );
  return merge(fonts, themify, googleFonts);
}
function clean(cb) {
  return del([paths.dist + "/**/*", paths.tmp + "/**/*"]);
}

function injectFiles() {
  return src("tmp/*.html")
    .pipe(
      inject(
        src([paths.tmpCSS], { read: false }).pipe(
          order(["!**/main*", "**/main*"]) // main.css needs to come last to override vendor CSS
        ),
        {
          relative: true
        }
      )
    )
    .pipe(
      inject(
        src([paths.tmpJS, "!**/map-custom.js"], {
          read: false
        }).pipe(
          // jQuery needs to come first, datetimepicker depends on moment and the rest of the vendor JS should come before our own scripts
          order(["**/jquery*", "**/moment.js", "vendor/*.js", "/**/*"])
        ),
        {
          relative: true
        }
      )
    )
    .pipe(dest(paths.tmp));
}

function dist_injectFiles() {
  return src(paths.distHtml)
    .pipe(
      inject(src(paths.distCSS, { read: false }), {
        relative: true
      })
    )
    .pipe(
      inject(
        src(paths.distJS, {
          read: false
        }).pipe(order(["**/*/vendor*.js", "/**/*"])),
        {
          relative: true
        }
      )
    )
    .pipe(dest(paths.dist));
}

function serveTmp() {
  return src(paths.tmp).pipe(
    webserver({
      port: 3000,
      livereload: true
    })
  );
}

function serveDist() {
  return src(paths.dist).pipe(
    webserver({
      port: 3001,
      livereload: true
    })
  );
}
function watchDist() {
  watch(["src", "gulpfile.js"], dist);
}
function watchTmp() {
  watch(["src", "gulpfile.js"], build);
}
