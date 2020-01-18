import { bootstrap, draw, getCanvas, getContext, options } from "canvas-recorder";
import { Vector2 } from "three";

import { Anchor } from "./anchor";

const FRAMES = 60;

options( {
    record: false,
    frames: FRAMES,
} );

// const EYE_DISTANCE = 10;
const context = getContext();
const canvas = getCanvas();

// function project( point: Point3D ): Point2D {
//     const fullDistance = EYE_DISTANCE + point[ 2 ];
//     const percentDistance = EYE_DISTANCE / fullDistance;

//     const y = point[ 1 ] * percentDistance;
//     const x = point[ 0 ] * percentDistance;

//     return [ x, y ];
// }



function drawControlPoints( controls: Anchor[] ): void {
    context.beginPath();

    for ( let i = 0; i < controls.length; i++ ) {
        if ( i === 0 ) {
            const from: Vector2 = controls[ i ].center;
            context.moveTo( from.x, from.y );
        }

        const ii: number = ( i + 1 ) % controls.length;
        const to: Vector2 = controls[ ii ].center;

        const anchorFrom: Vector2 = controls[ i ].b;
        const anchorTo: Vector2 = controls[ ii ].a;

        context.bezierCurveTo( anchorFrom.x, anchorFrom.y, anchorTo.x, anchorTo.y, to.x, to.y );
    }

    context.stroke();
}

const vector = new Vector2();

function createCircle( radius: number, length = 100 ): Anchor[] {
    return [
        Anchor.fromOrientation( vector.set( radius, 0 ), Math.PI / 2, length ),
        Anchor.fromOrientation( vector.set( 0, radius ), Math.PI, length ),
        Anchor.fromOrientation( vector.set( -radius, 0 ), -Math.PI / 2, length ),
        Anchor.fromOrientation( vector.set( 0, -radius ), 0, length ),
    ];
}

const sets: Anchor[][] = [
    createCircle( 100 ),
    createCircle( 150, 200 ),
    createCircle( 170 ),
    createCircle( 200, 120 ),
];

const tick = Math.PI / ( FRAMES / 2 );

draw( () => {
    // Has to be done every frame as the current implementation of canvas-recorder (1.8.0) does
    // not include the state of the transform.
    canvas.width = canvas.width;
    context.strokeStyle = "black";
    context.fillStyle = "rgb(243, 92, 241)";
    context.fillRect( 0, 0, canvas.width, canvas.height );
    context.translate( 512, 512 );

    sets.forEach( ( set, i ) => {
        const sign = i % 2 === 0 ? -1 : 1;
        set.forEach( a => a.rotation += tick * sign );
        context.lineWidth = i;
        drawControlPoints( set );
    } );
} );


bootstrap( { clear: true } );

