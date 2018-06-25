import { options, bootstrap, draw } from "canvas-recorder";
import { Square } from "./square";
import { Vector2 } from "three";
import easeIn from "eases/quad-in";
import easeOut from "eases/quad-out";

const SIZE = 1024;
const AMOUNT = 10;
const LOOP_MS = 4000;
const SQUARE_SIZE =  SIZE / AMOUNT ;
const squares: Square[] = [];
let oldP: number = 0;

for ( let y = 0; y < SIZE - SQUARE_SIZE; y += SQUARE_SIZE ) {
    for( let x = 0; x < SIZE - SQUARE_SIZE; x += SQUARE_SIZE ) {
        squares.push( new Square(
            new Vector2( SQUARE_SIZE,  SQUARE_SIZE ),
            new Vector2( x, y )
        ) );
    }
}

const sample: HTMLCanvasElement = document.createElement( "canvas" );
const sampleContext: CanvasRenderingContext2D = sample.getContext( "2d" )!;
const director: Square = new Square( new Vector2( AMOUNT, AMOUNT ), new Vector2() );

sample.width = AMOUNT;
sample.height = AMOUNT;

options( {
    size: [ SIZE, SIZE ],
    record: false,
    color: "black",
    frames: 4 * 60 + 100,
    fps: 60
} );

draw( ( context: CanvasRenderingContext2D, time: number ) => {
    const p = ( time % LOOP_MS ) / LOOP_MS;
    const sideA: boolean = p < 0.5;
    const t: number = p < 0.5 ? easeIn( Math.min( p * 2 * 1.25, 1 ) ) : easeOut( ( p - 0.5 ) * 2 );
    const reset: boolean = ( oldP < 0.5 && p > 0.5 );

    director.render( sampleContext, t, false );

    const data: Uint8ClampedArray = sampleContext.getImageData( 0, 0, AMOUNT, AMOUNT ).data;

    squares.forEach( ( square: Square, i: number ) => {
        let state: number = data[ i * 4 ] < ( 255 / 2 ) ? 1 : 0;

        if ( reset ) {
            square.reset();
        }

        square.render( context, state );
    } );

    oldP = p;
} );

bootstrap();