const gulp        = require( "gulp" );
const babelify    = require( "babelify" );
const browserify  = require( "browserify" );
const source      = require( "vinyl-source-stream" );
const cleanCSS    = require( "gulp-clean-css" );
const sass        = require( "gulp-sass" );
const connect     = require( "gulp-connect" );
const pug         = require( "gulp-pug" );

gulp.task( "scripts", function() {
    return browserify( "javascript/main.js", {
            debug: true
        } )
        .transform( babelify, {  "presets": [ "env" ] } )
        .bundle()
        .on( "error", function( error ) {
            console.log( error );
            this.emit( "end" );
        } )
        .pipe( source( "main.js" ) )
        .pipe( gulp.dest( "public/javascript/" ) )
        .pipe( connect.reload() );
} );

gulp.task( "styles", function() {
    return gulp.src( "scss/*.scss" )
        .pipe( sass().on( "error", sass.logError ) )
        .pipe( cleanCSS() )
        .pipe( gulp.dest( "public/stylesheets" ) )
        .pipe( connect.reload() );
} );

gulp.task( "connect", function() {
    return connect.server( {
        root: "public",
        livereload: true
    } );
} );

gulp.task( "html", function() {
    return gulp.src( "views/*.pug" )
        .pipe( pug() )
        .pipe( gulp.dest( "public" ) )
        .pipe( connect.reload() );
} );

gulp.task( "watch", function() {
    gulp.watch( "javascript/**/*.js", [ "scripts" ] );
    gulp.watch( "scss/**/*.scss", [ "styles" ] );
    gulp.watch( "views/**/*.pug", [ "html" ] );
} );

gulp.task( "build", [ "scripts", "styles", "html" ] );

gulp.task( "default", [ "build", "watch", "connect" ] );