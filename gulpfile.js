const prj_folder = "dist";
const src_folder = "#src";

const path = {
    build: {
        html: `${prj_folder}/`,
        css: `${prj_folder}/css`,
        js: `${prj_folder}/js`,
        img: `${prj_folder}/img`,
    },
    src: {
        html: `${src_folder}/*.html`,
        css: `${src_folder}/css/*.css`,
        js: `${src_folder}/js/main.js`,
        img: `${src_folder}/img/*.{png, svg, jpg}`,
    },
    watch: {
        html: `${src_folder}/*.html`,
        css: `${src_folder}/css/*.css`,
        js: `${src_folder}/js/*.js`,
        img: `${src_folder}/img/*.{png, svg, jpg}`,
    },
    clean: `./${prj_folder}/`,
};

const {src, dest} = require("gulp");
const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");
const del = require("del");
const concatCss = require("gulp-concat-css");
const mediaCss = require("gulp-group-css-media-queries");
const minifyCss = require("gulp-minify-css");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const webpHtml = require("gulp-webp-html");
const webpCss = require("gulp-webpcss");
const svgSprite = require("gulp-svg-sprite");
const gulpGroupCssMediaQueries = require("gulp-group-css-media-queries");

function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: `./${prj_folder}/`
        },
        port: 3000
    })
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(webpHtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(concatCss("style.css"))
        .pipe(mediaCss())
        .pipe(
            autoprefixer({
            browsers: ["last 10 versions"],
            cascade: true
        })
        )
        .pipe(
            webpCss({
                webpClass: '.webp',
                noWebpClass: '.no-webp'
            })
        )
        .pipe(dest(path.build.css))
        .pipe(minifyCss())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function img() {
    return src(path.src.img)
        .pipe(
            webp({
                quality: 65
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(
            imagemin({
                interlaced: true,
                progressive: true,
                optimizationLevel: 5,
                svgoPlugins: [{removeViewBox: true}]
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
    }

gulp.task("svgSprite", function() {
    return gulp.src([src_folder + "/img/*.svg"])
    .pipe(
        svgSprite({
            mode: {
                stack: {
                    sprite: "../icons/icon.svg",
                }
            }
        })
    )
    .pipe(dest(path.build.img))
})

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], img);
}

function clean() {
    return del(path.clean);
}

const build = gulp.series(clean, gulp.parallel(js, img, css, html));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.img = img;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;