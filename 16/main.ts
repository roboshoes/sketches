import { options, bootstrap, draw } from "canvas-recorder";
// @ts-ignore
import { Noise } from "noisejs";

const noiseX = new Noise( 10 );
const noiseY = new Noise( 20 );
const SIZE = 40;
const TILE = 1024 / SIZE;
const RADIUS = 10;
const DIVIDER = 400;

options( {
    size: [ 1024, 1024 ],
    record: false,
    frames: 1,
    color: "#741974",
} );

draw( ( context: CanvasRenderingContext2D, ) => {

    for ( let y = 0; y < SIZE; y++ ) {
        for ( let x = 0; x < SIZE; x++ ) {
            const centerX = TILE * x + TILE / 2;
            const centerY = TILE * y + TILE / 2;

            const pointX: number = noiseX.simplex2( centerX / DIVIDER, centerY / DIVIDER ) * 0.5 + 0.5;
            const pointY: number = noiseY.simplex2( centerX / DIVIDER, centerY / DIVIDER ) * 0.5 + 1;


            context.beginPath();
            context.moveTo( centerX + RADIUS, centerY );
            context.arc( centerX, centerY, RADIUS, 0, Math.PI * 2 );
            context.lineWidth = 0 + pointX * 6.5;
            context.strokeStyle = "white";
            context.stroke();

            context.save();
            context.beginPath();
            context.translate( centerX, centerY );
            context.rotate( pointY * Math.PI * 2 );
            context.moveTo( 0, 0 );
            context.lineTo( RADIUS - 4, 0 );
            context.arc( 0, 0, RADIUS - 4, 0, Math.PI * 2 * pointY );
            context.fillStyle = "white";
            context.closePath();
            context.fill();
            context.restore();
        }
    }

} );

bootstrap();