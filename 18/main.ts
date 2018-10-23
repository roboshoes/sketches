import { bootstrap, options, draw } from "canvas-recorder";
import { Vector2 } from "three";
// @ts-ignore
import { Noise } from "noisejs";
// @ts-ignore
import maskUrl from "./overlay.png";

const SEED_A = 213234;
const SEED_B = 684512;
const WIDTH = 140;
const HEIGHT = 70

const noise: Noise = new Noise( Math.random() );
const normal = new Vector2();
const zero = new Vector2();
const mask = new Image();
let maskData: Uint8ClampedArray;

options( {
    size: [ 1048 * 2, 1024 ],
    record: false,
    color: "black",
    frames: 1,
} );

draw( ( context: CanvasRenderingContext2D ) => {
    const noiseA = generateField( SEED_A, WIDTH, HEIGHT );
    const noiseB = generateField( SEED_B, WIDTH, HEIGHT );
    const vector = new Vector2();
    const origin = new Vector2();

    context.lineWidth = 1;
    context.strokeStyle = "white";

    const MULTI_WIDTH = 2048 / WIDTH;
    const MULTI_HEIGHT = 1024 / HEIGHT;

    for ( let x = 0; x < WIDTH; x++ ) {
        for ( let y = 0; y < HEIGHT; y++ ) {
            origin.set( x * MULTI_WIDTH, y * MULTI_HEIGHT );
            vector.set( noiseA[ x ][ y ], noiseB[ x ][ y ] ).multiplyScalar( MULTI_WIDTH * 1.5 ).add( origin );

            const isOn: boolean = getMaskValue(
                Math.round( Math.min( 1024, x * MULTI_WIDTH ) ),
                Math.round(y * MULTI_HEIGHT ),
            )

            drawArrow( origin, vector, context );
            context.lineWidth = isOn ? 3 : 1;
            context.lineCap = "butt";
            context.stroke();
        }
    }
} );

function generateField( seed: number, width: number, height: number ): number[][] {
    noise.seed( seed );

    const result: number[][] = new Array( width );
    const divider = 80;

    for ( let x = 0; x < width; x++ ) {
        result[ x ] = new Array( height );
        for ( let y = 0; y < height; y++ ) {
            result[ x ][ y ] = noise.simplex2( x / divider, y / ( divider * 0.5 ) );
        }
    }

    return result;
}

function drawArrow( from: Vector2, to: Vector2, context: CanvasRenderingContext2D ) {
    context.beginPath();
    context.moveTo( from.x, from.y );
    context.lineTo( to.x, to.y );

    const length: number = normal.copy( to ).sub( from ).length();
    const size = Math.min( length / 2, 5 );

    normal.copy( to ).sub( from ).normalize().multiplyScalar( size ).rotateAround( zero, Math.PI * 0.75 );
    context.lineTo( to.x + normal.x, to.y + normal.y );

    context.moveTo( to.x, to.y );
    normal.copy( to ).sub( from ).normalize().multiplyScalar( size ).rotateAround( zero, Math.PI * -0.75 );
    context.lineTo( to.x + normal.x, to.y + normal.y );
}

function loadImage(): Promise<void> {
    return new Promise<void>( ( resolve ) => {
        mask.src = maskUrl;
        mask.onload = () => {
            const canvas = document.createElement( "canvas" );
            const context = canvas.getContext( "2d" );
            canvas.width = mask.width;
            canvas.height = mask.height;

            context.drawImage( mask, 0, 0 );

            maskData = context.getImageData(0, 0, mask.width, mask.height ).data;

            resolve();
        };
    } );
}

function getMaskValue( x: number, y: number ): boolean {
    const target = ( y * mask.width + x ) * 4;

    return maskData[ target ] > 0;
}

loadImage().then( () => bootstrap() );