import { draw, getCanvas, options, start } from "canvas-recorder";
import take from "mout/array/take";

import { LINES, stage } from "./config";
import { Line } from "./line";

const lines = take( LINES, i => new Line( i / ( LINES - 1 ) ) );

options( {
    size: [ stage.width, stage.height ],
    frames: 5 * 30,
    clear: true,
    record: false,
} );

draw( context => {
    lines.forEach( line => line.render( context ) );
} );

document.body.appendChild( getCanvas() );

start();
