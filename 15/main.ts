import { bootstrap, draw, options } from "canvas-recorder/gl";
import { ImageShader } from "image-shader";
import { random, times } from "lodash";
import { Vector2 } from "three";

// @ts-ignore
import fragment from "./shader.glsl";

const DURATION = 6000;
const TAU = Math.PI * 2;
const SIZE = new Vector2( 1024, 1024 );

const canvas = document.createElement( "canvas" );
const context = canvas.getContext( "2d" );

canvas.width = 1024;
canvas.height = 1024;

const corner = new Vector2( 0, 1024 );

times<Vector2>( 80, () => new Vector2( random( -100, 1124 ), random( -100, 1124 ) ) )
    .sort( ( a, b ) =>  b.distanceTo( corner ) - a.distanceTo( corner ) )
    .forEach( ( position: Vector2 ) => {
        const radius = random( 100, 250 );
        const relative = position.clone().divide( SIZE ).multiplyScalar( 255 ).floor();
        const relativeRadius = Math.floor( radius / SIZE.x * 255 );

        context.beginPath();
        context.moveTo( position.x + radius, position.y );
        context.arc( position.x, position.y, radius, 0, TAU );
        context.fillStyle = `rgb( ${ relative.x }, ${ 255 - relative.y }, ${ relativeRadius } )`;
        context.fill();
    } );

const shader = new ImageShader( canvas, fragment );

options( {
    size: [ 1024, 1024 ],
    record: false,
    clear: false,
    canvas: shader.domElement,
} );

draw( ( _, time: number ) => {
    shader.uniforms.time = ( time % DURATION ) / DURATION;
    shader.render();
} );

bootstrap();
