const fs = require( "fs" );
const exec = require( "child_process" ).exec;
const nextHighest = fs
    .readdirSync( ".", "utf8" )
    .filter( name => !isNaN( Number( name ) ) )
    .reduce( ( highest, current ) => Math.max( highest, current ), 0 ) + 1;

const name = process.argv[ 2 ] || `0${nextHighest}`.slice( -2 );

if ( ! fs.existsSync( name ) ) {

    console.log( "-> Generating source" );
    exec( `cp -r _template/ ${ name }/`, () => {

        const packages = [
            "@roboshoes/eslint-config",
            "@typescript-eslint/eslint-plugin",
            "@typescript-eslint/eslint-plugin-tslint",
            "eslint",
            "parcel-bundler",
            "tslint",
            "typescript",
        ];

        console.log( "-> Installing packages" );
        exec( "npm install --save-dev " + packages.join( " " ), { cwd: name }, () => {

            console.log( `\nFolder: ${ name }` );
        } );
    } );
}
