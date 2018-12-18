import { bootstrap, draw, options, stop } from "canvas-recorder";

import { Container } from "./container";

const container = new Container();

stop();

options( {
    record: false,
    clear: true,
    color: "black",
} );

draw( ( context: CanvasRenderingContext2D ) => {

    context.translate( 512, 512 );
    context.lineWidth = 1;
    context.strokeStyle = "white";

    container.draw( context );

    context.translate( -512, -512 );

} );

bootstrap( { clear: true } );