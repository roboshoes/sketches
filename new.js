const fs = require( "fs" );
const exec = require( "child_process" ).exec;
const nextHighest = fs
    .readdirSync( ".", "utf8" )
    .filter( name => !isNaN( Number( name ) ) )
    .reduce( ( highest, current ) => Math.max( highest, current ), 0 ) + 1;

const name = process.argv[ 2 ] || nextHighest.toString();

if ( ! fs.existsSync( name ) ) {

    console.log( "-> Generating source" );
    exec( `cp -r _template/ ${ name }/`, () => {

        console.log( "-> Installing packages" );
        exec( "npm install --save-dev parcel-bundler typescript", { cwd: name }, () => {

            console.log( `\nFolder: ${ name }` );
        } );
    } );
}
