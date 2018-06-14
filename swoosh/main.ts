import { bootstrap, options, draw } from "canvas-recorder";
import { Line } from "./line";

const TAU = Math.PI * 2;
const SIZE = 300;
const RADIUS = Math.sqrt( 2 ) * SIZE;

const lines: Line[] = [];

function safeClamp( value: number, limit: number ): number {
    return Math.min( Math.abs( value ), limit ) * Math.sign( value );
}

options( {
    record: false,
    size: [ 1024, 1024 ],
    clear: true,
    color: "white",
} );

draw( ( context: CanvasRenderingContext2D, time: number ) => {

    context.translate( 512, 512 );

    const t = ( time % 6000 ) / 6000;
    const multi = t * TAU;

    const x: number = safeClamp( Math.cos( multi ) * RADIUS, SIZE );
    const y: number = safeClamp( Math.sin( multi ) * RADIUS, SIZE );

    context.beginPath();

    context.fillStyle = "black";
    context.fillRect( x, y, 10, 10 );

    context.translate( -512, -512 );

} );

bootstrap();
