const gulp = require("gulp");
const del = require('del');
const gulpSass = require('gulp-sass')(require('sass'));
const watch = require("gulp-watch");
const {uploadToGcs} = require("./gcs_uploader");
const browserSync = require('browser-sync').create();
const browserify = require("browserify");
const tsify = require("tsify");
const source = require("vinyl-source-stream");
const uglify = require("gulp-uglify");
const htmlMin = require("gulp-htmlmin");
const cleanCss = require("gulp-clean-css");
const babel = require("gulp-babel");
const env = require("./env");
const glob = require("glob");

async function clean() {
    await del(["dist", "build"]);
}

function buildHtml() {
    return fileCopyTask(
        gulp.src("src/html/index.html")
            .pipe(gulp.dest("build"))
    );
}

function buildCss() {
    return fileCopyTask(gulp.src("src/scss/**.scss")
        .pipe(gulpSass())
        .pipe(gulp.dest("build/css")));
}

async function buildJs() {
    await tsToJs();
    return babelJs();
}

function tsToJs() {
    const tsFiles = glob.sync('./src/**/**.ts');

    return fileCopyTask(
        browserify({
            entries: tsFiles,
            cache: {},
            packageCache: {},
        })
            .plugin(tsify)
            .bundle()
            .pipe(source(env.TS_OUT))
            .pipe(gulp.dest("build/js"))
    );
}

function babelJs() {
    return gulp.src("build/js/**.js")
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .pipe(gulp.dest("build/js"));
}

function uglifyAndBabelJs() {
    return fileCopyTask(
        gulp.src(`build/js/${env.TS_OUT}`)
            .pipe(uglify())
            .pipe(gulp.dest(`dist/js`))
    );
}

function minifyHtml() {
    return fileCopyTask(
        gulp.src("build/**.html")
            .pipe(htmlMin({
                collapseWhitespace: true
            }))
            .pipe(gulp.dest("dist"))
    );
}


async function minifyCss() {
    return fileCopyTask(
        gulp.src("build/css/*.css")
            .pipe(cleanCss({compatibility: 'ie8'}))
            .pipe(gulp.dest("dist/css"))
    );
}

// 使用原生 async await 會導致文件在還沒複製完畢時就觸發下一個 task，因此特別使用 promise - resolve 的方式，聆聽 end event 後才結束這個 task
function fileCopyTask(task) {
    return new Promise((resolve, reject) => {
        task.on("end", () => {
            resolve();
        });
    });
}

async function uploadGcsTest() {
    await uploadToGcs(env.TUTOR_TEST_MACHINE);
}

async function uploadGcsAlpha() {
    await uploadToGcs(env.ALPHA_MACHINE);
}

async function watchFiles() {
    watch("./src/scss/*.scss").on("change", async () => {
        await buildCss();
        await reloadBrowser();
    });

    watch("./src/html/*.html").on("change", async () => {
        await buildHtml();
        await reloadBrowser();
    });

    watch(["./src/ts/*.ts", "./src/dataprovider/*.ts"]).on("change", async () => {
        await buildJs();
        await reloadBrowser();
    });
}

async function reloadBrowser() {
    browserSync.reload();
}

async function serve() {
    browserSync.init({
        server: {
            baseDir: "build"
        }
    });
}

exports.clean = clean;
exports.build = gulp.series(clean, buildHtml, buildCss, buildJs);
exports.compress = gulp.series(minifyHtml, minifyCss, uglifyAndBabelJs);

exports.productionBuild = gulp.series(exports.build, exports.compress);
exports.uploadGcs = gulp.parallel(uploadGcsTest, uploadGcsAlpha);

exports.dev = gulp.series(exports.build, serve, watchFiles);
