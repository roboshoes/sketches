import { bootstrap, draw, options, stop } from "canvas-recorder";

import { Container } from "./container";

const container = new Container();

stop();

options( {
    record: false,
    clear: true,
    frames: 60 * 6,
    fps: 60,
    color: "black",
} );

draw( ( context: CanvasRenderingContext2D, _, t: number  ) => {

    context.translate( 512, 512 );
    context.lineWidth = 1;
    context.strokeStyle = "white";

    container.update( t );
    container.draw( context );

    context.translate( -512, -512 );

} );

bootstrap( { clear: true } );