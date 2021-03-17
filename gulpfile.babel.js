
// HTML 
import htmlmin from "gulp-htmlmin"

// CSS
import postcss from "gulp-css"
import cssnano from "cssnano"
import autoprefixer from "autoprefixer"

// Javascript
import gulp from "gulp"
import babel from "gulp-babel"
import terser from "gulp-terser"

// PUG
import pug from "gulp-pug"

// SASS
import sass from "gulp-dart-sass"

// Common
import concat from "gulp-concat"

const production = false

// Clean CSS
import clean from "gulp-purgecss"

// Cache bust 
import cacheBust from "gulp-cache-bust"

// Optimización de imagenes
import imagemin from "gulp-imagemin"

// Browser sync 
import { init as server, stream, reload} from "browser-sync"

// Plumber
import plumber from "gulp-plumber"

// Varibables/constantes

const cssPlugins = [
    cssnano(),
    autoprefixer()
]

gulp.task("htmlmin", () =>{
    return gulp
        .src("./src/*.html")
        .pipe(plumber())
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(cacheBust({
            type: "timestamp"
        }))
        .pipe(gulp.dest("./public/"))
})

gulp.task("styles", () =>{
    return gulp
        .src("./src/css/*.css")
        .pipe(plumber())
        .pipe(concat("styles-min.css"))
        .pipe(postcss(cssPlugins))
        .pipe(gulp.dest("./public/css"))
        .pipe(stream())
})

gulp.task("babel", () =>{
    return gulp
        .src("./src/js/*.js")
        .pipe(plumber())
        .pipe(concat("scripts-min.js"))
        .pipe(babel({
            presets:["@babel/env"]
        })) 
        .pipe(terser())
        .pipe(gulp.dest("./public/js"))
}) 

gulp.task("views", ()=>{
    return gulp.src("./src/views/pages/*.pug")
    .pipe(pug({
        pretty: production ? false : true
    }))
    .pipe(gulp.dest("./public"))
})

gulp.task("sass", ()=>{
    return gulp.src("./src/scss/styles.scss")
    .pipe(sass({
        outputStyle: "compressed"
    }))
    .pipe(gulp.dest("./public/css"))
})

gulp.task("imgmin", () =>{
    return gulp.src("./src/assets/img/**/*")
    .pipe(plumber())
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
    .pipe(gulp.dest("./public/assets/img/"))
})

gulp.task("clean", ()=>{
    return gulp.src("./public/css/styles.css")
    .pipe(clean({
        content: ["./public/*.html"]
    }))
    .pipe(gulp.dest("./public/css"))
})

gulp.task("default", () =>{
    server({
        server:"./public"
    })
    // gulp.watch("./src/*.html", gulp.series("htmlmin")).on("change", reload)
    // gulp.watch("./src/css/*.css", gulp.series("styles")).on("change", reload)

    gulp.watch("./src/views/**/*.pug", gulp.series("views")).on("change", reload)
    gulp.watch("./src/scss/**/*.scss", gulp.series("sass")).on("change", reload)
    gulp.watch("./src/js/*.js", gulp.series("babel")).on("change", reload)
})

