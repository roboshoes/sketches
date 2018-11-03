const fs = require( "fs" );
const exec = require( "child_process" ).exec;

function done( path ) {
    return function( error ) {
        if ( error ) console.warn( `deleting ${ path } failed.` );
        else console.log( `Deleted ${ path }` );
    }
}

fs
    .readdirSync( ".", "utf-8" )
    .filter( name => !isNaN( Number( name ) ) )
    .forEach( directory => {
        const packageLock = `${ directory }/package-lock.json`;
        const nodeModules = `${ directory }/node_modules`;

        if ( fs.existsSync( packageLock ) ) {
            fs.unlink( packageLock, done( packageLock ) );
        }

        if ( fs.existsSync( nodeModules ) ) {
            exec( `rm -rf ${ nodeModules }`, done( nodeModules ) );
        }
    } );