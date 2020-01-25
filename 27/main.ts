import { bootstrap, draw, options, cleanup, start } from "canvas-recorder/gl";
import { ImageShader } from "image-shader";

// @ts-ignore
import fragment from "./fragment.glsl";
import { Square } from "./square";

const squares: Square[] = [];
const SIZE = 1024;

const canvas = document.createElement( "canvas" );
canvas.width = SIZE;
canvas.height = SIZE;

const context = canvas.getContext( "2d" )!;
const shader = new ImageShader( canvas, fragment );

for ( let i = 0; i < 10; i++ ) {
    squares.push( new Square() );
}

options( {
    size: [ 1024, 1024 ],
    frames: 60 * 6,
    record: false,
    canvas: shader.domElement,
    color: "white",
} );

draw( ( _1, _2, t: number ) => {
    context.fillStyle = "white";
    context.fillRect( 0, 0, SIZE, SIZE );
    context.lineWidth = 3;
    context.fillStyle = "black";

    squares.forEach( ( s, i ) => {
        context.save();
        const percent = ( ( i / squares.length ) + t ) % 1;

        context.translate( 512, 512 );
        context.rotate( Math.PI / 4 * percent );
        context.translate( -512, -512 );

        s.draw( context, percent );
        context.restore();
    } );

    shader.update();
} );

cleanup( start );

bootstrap();
