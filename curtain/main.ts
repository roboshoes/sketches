import { ImageShader } from "image-shader";
import { draw, options, start, getCanvas } from "canvas-recorder/gl";

// @ts-ignore: Shader are all imported as strings.
import fragment from "./shader.glsl";

const canvas = document.createElement( "canvas" );
const context = canvas.getContext( "2d" )!;

canvas.width = 1024;
canvas.height = 1024;

context.fillStyle = "black";
context.fillRect( 0, 0, 1024, 1024 );
context.beginPath();

for ( let i = 0; i < 1040; i += 26 ) {
    context.beginPath();
    context.moveTo( i, 0 );
    context.lineTo( i, 1024 );
    context.lineWidth = i / 1000 * 20;
    context.strokeStyle = "white";
    context.stroke();
}

const image = new ImageShader( canvas, fragment );

options( {
    canvas: image.domElement,
    record: false,
    clear: false,
    size: [ 1024, 1024 ],
    frames: 30 * 12,
    fps: 30,
} );

draw( ( c, delta: number ) => {
    image.uniforms.time = delta / 1000;
    image.render();
} );

start();

document.body.appendChild( getCanvas() );

