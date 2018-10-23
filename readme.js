const fs = require( "fs" );

const folders = fs
    .readdirSync( ".", "utf8" )
    .filter( name => !isNaN( Number( name ) ) )
    .filter( name => fs.existsSync(`./${ name }/example.png` ) )
    .sort( ( a, b ) => parseInt( a ) - parseInt( b ) )
    .map( folder => `<img src="./${ folder }/example.png" width="25%" align="left" />` );

fs.writeFileSync( "README.md", `
# Sketches

A collection of different sketches I have worked on over time. This list is not exhaustive,
but I didn't want a bunch of seperate repos.

${ folders.join( "\n" ) }
`);