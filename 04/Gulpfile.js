const gulp        = require( "gulp" );
const babelify    = require( "babelify" );
const browserify  = require( "browserify" );
const connect     = require( "gulp-connect" );
const pug         = require( "gulp-pug" );
const cleanCSS    = require( "gulp-clean-css" );
const sass        = require( "gulp-sass" );
const source      = require( "vinyl-source-stream" );
const del         = require( "del" );
const runSequence = require( "run-sequence" );
const glslify     = require( "glslify" );

gulp.task( "scripts", function() {
    return browserify( "javascript/main.js", {
            debug: true
        } )
        .transform( babelify, {  "presets": [ "env" ] } )
        .transform( glslify )
        .bundle()
        .on( "error", function( error ) {
            console.log( error );
            this.emit( "end" );
        } )
        .pipe( source( "main.js" ) )
        .pipe( gulp.dest( "public/javascripts/" ) )
        .pipe( connect.reload() );
} );

gulp.task( "connect", function() {
    return connect.server( {
        root: "public",
        livereload: true
    } );
} );

gulp.task( "pug", function() {
    return gulp.src( "pug/*.pug" )
        .pipe( pug() )
        .pipe( gulp.dest( "public" ) )
        .pipe( connect.reload() );
} );

gulp.task( "watch", function() {
    gulp.watch( "javascript/**", [ "scripts" ] );
    gulp.watch( "pug/**/*.pug", [ "pug" ] );
    gulp.watch( "scss/**/*.scss", [ "scss" ] );
    gulp.watch( "assets/**", [ "assets" ] );
} );

gulp.task( "scss", function() {
    return gulp.src( "scss/*.scss" )
        .pipe( sass().on( "error", sass.logError ) )
        .pipe( cleanCSS() )
        .pipe( gulp.dest( "public/stylesheets" ) )
        .pipe( connect.reload() );
} );

gulp.task( "assets", function() {
    return gulp.src( [ "assets/**/*", "!assets/.gitkeep" ] )
        .pipe( gulp.dest( "public" ) );
} );

gulp.task( "clean", function() {
    return del( [ "public" ] );
} );

gulp.task( "default", callback => runSequence(
    "clean", [
        "scripts",
        "pug",
        "scss",
        "watch",
        "assets",
        "connect"
    ],
    callback
) );

gulp.task( "build", callback => runSequence(
    "clean", [
        "pug",
        "scss",
        "assets"
    ],
    callback
) );
