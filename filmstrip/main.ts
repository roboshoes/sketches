import { draw, getCanvas, options, start } from "canvas-recorder";

import { ColumnPool } from "./components/column-pool";

document.body.appendChild( getCanvas() );

const pool = new ColumnPool();
const time = 6000;

options( {
    size: [ 1024, 1024 ],
    record: true,
    clear: true,
    color: "black",
    frames: 30 * 6,
    fps: 30,
} );

draw( ( context: CanvasRenderingContext2D, delta: number ) => {
    const t: number = ( delta % time ) / time ;

    pool.calculate( t );
    pool.draw( context );
} );

start();
