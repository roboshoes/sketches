import { draw, getCanvas, options, start } from "canvas-recorder";

import { HEIGHT, WIDTH, GRID_SIZE } from "./constants";
import { Grid } from "./grid";

const grid = new Grid( GRID_SIZE );

options( {
    record: false,
    clear: true,
    frames: 1,
    size: [ WIDTH, HEIGHT ],
} );

draw( ( context: CanvasRenderingContext2D ) => {

    grid.fill( context );
    grid.drawBubbles( context );

} );

document.body.appendChild( getCanvas() );

start();
