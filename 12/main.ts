import { bootstrap, options, draw, stop } from "canvas-recorder";
import { Line } from "./line";
import { Vector2 } from "three";

const TAU = Math.PI * 2;
const SIZE = 300;
const MS = 5000;
const RADIUS = Math.sqrt( 2 ) * SIZE;
const CREATION_TIME = 10;
const lines: Line[] = [];

let timeAtLastSpawn = 0;

function safeClamp( value: number, limit: number ): number {
    return Math.min( Math.abs( value ), limit ) * Math.sign( value );
}

function removeDeadLines() {
    for ( let i = 0; i < lines.length; i++ ) {
        if ( ! lines[ i ].alive ) {
            lines.splice( i, 1 );
            i--;
        }
    }
}

options( {
    record: true,
    size: [ 1024, 1024 ],
    clear: true,
    color: "#590457",
    fps: 30,
} );

draw( ( context: CanvasRenderingContext2D, time: number ) => {

    context.translate( 512, 512 );

    const t = ( time % MS ) / MS;
    const multi = t * TAU + ( TAU * .75 );

    const x: number = safeClamp( Math.cos( multi ) * RADIUS, SIZE );
    const y: number = safeClamp( Math.sin( multi ) * RADIUS, SIZE );

    removeDeadLines();

    if ( time > MS && lines.length === 0 ) {
        stop();
    }

    if ( time - timeAtLastSpawn > CREATION_TIME && time < MS ) {
        lines.push( new Line( new Vector2( x, y ), time ) );
        timeAtLastSpawn = time;
    }

    lines.forEach( line => line.render( context, time ) );

    // context.beginPath();

    // context.fillStyle = "black";
    // context.fillRect( x - 5 , y - 5, 10, 10 );

    context.translate( -512, -512 );

} );

bootstrap();
