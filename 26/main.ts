import { bootstrap, draw, options } from "canvas-recorder";

import { Square } from "./square";

options( {
    size: [ 1024, 1024 ],
    frames: 30 * 6,
    record: false,
    clear: true,
    color: "white",
} );

const squares: Square[] = [];

for ( let i = 0; i < 10; i++ ) {
    squares.push( new Square() );
}

draw( ( context: CanvasRenderingContext2D, _, t: number ) => {
    context.lineWidth = 3;

    squares.forEach( ( s, i ) => s.draw( context, ( ( i / squares.length ) + t ) % 1 ) );
} );

bootstrap();