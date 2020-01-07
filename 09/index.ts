import { getCanvas, draw, start, stop, options } from "canvas-recorder";
import { Vector2 } from "three";
import triangulate from "delaunay-triangulate";
import { times, random } from "lodash"

const LERP = 0.01;
const WIDTH = 1024;
const HEIGHT = 1024;

options( {
    record: false,
    clear: false,
    frames: 100,
    size: [ WIDTH, HEIGHT ],
} );

document.body.appendChild( getCanvas() );

interface Triangle {
    a: Vector2;
    b: Vector2;
    c: Vector2;
}

const ab: Vector2 = new Vector2();
const bc: Vector2 = new Vector2();
const ca: Vector2 = new Vector2();
const vector = new Vector2();

let alpha = 1;
let stage = 0;
let count = 0;

let indices: [number, number, number][];
let vectors: [number, number][];
let triangles: Triangle[];

function generate() {
    vectors = times<[number, number]>( 2, () => ( [
        random( 0.1, 0.9 ) * WIDTH,
        random( 0.1, 0.9 ) * HEIGHT,
    ] ) ).concat( [
        [ 0, 0 ],
        [ random( 0.2, 0.8 ) * WIDTH, 0 ],
        [ WIDTH, 0 ],
        [ WIDTH, random( 0.2, 0.8 ) * HEIGHT ],
        [ WIDTH, HEIGHT ],
        [ random( 0.2, 0.8 ) * WIDTH, HEIGHT ],
        [ 0, HEIGHT ],
        [ 0, random( 0.2, 0.8 ) * HEIGHT ],
    ] );

    indices = triangulate( vectors );

    triangles = indices.map( ( [a , b, c ] )=> {
        return {
            a: new Vector2( vectors[ a ][ 0 ], vectors[ a ][ 1 ] ),
            b: new Vector2( vectors[ b ][ 0 ], vectors[ b ][ 1 ] ),
            c: new Vector2( vectors[ c ][ 0 ], vectors[ c ][ 1 ] ),
        }
    } );

    stage = 0;
    alpha = 1;
}

draw( ( context: CanvasRenderingContext2D ) => {

    if ( stage === 0 ) {

        let didDraw = false;

        for ( let i = 0; i < triangles.length; i++ ) {
            const triangle = triangles[ i ];

            const tooShort = [ triangle.a, triangle.b, triangle.c ].some( ( point, i, points ) => {
                return vector.copy( point ).distanceTo( points[ ( i + 1 ) % 3 ] ) < 10;
            } );

            context.fillStyle = "rgba( 255, 255, 255, 0.002 )";
            context.fillRect( 0, 0, WIDTH, HEIGHT );

            if ( tooShort ) continue;

            context.beginPath();
            context.moveTo( triangle.a.x, triangle.a.y );
            context.lineTo( triangle.b.x, triangle.b.y );
            context.lineTo( triangle.c.x, triangle.c.y );
            context.closePath();

            const color = Math.floor( ( 1 - alpha ) * 255 );

            context.strokeStyle = `rgba( 255, ${ color }, ${ color }, ${ 1 - alpha } )`;
            context.lineWidth = 1;
            context.stroke();

            ab.lerpVectors( triangle.a, triangle.b, random( LERP, LERP + 0.03 ) );
            bc.lerpVectors( triangle.b, triangle.c, random( LERP, LERP + 0.03 ) );
            ca.lerpVectors( triangle.c, triangle.a, random( LERP, LERP + 0.03 ) );

            triangle.a.copy( ab );
            triangle.b.copy( bc );
            triangle.c.copy( ca );

            didDraw = true;
        }

        alpha -= 0.018;

        if ( !didDraw ) stage = 1;

    } else if ( stage === 1 ) {

        context.fillStyle = "rgba( 255, 255, 255, 0.09 )";
        context.fillRect( 0, 0, WIDTH, HEIGHT );

        count++;

        if ( count >= 100 ) {
            generate();
            count = 0;
        }
    }

} );

generate();
start();