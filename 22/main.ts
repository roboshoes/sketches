import { draw, getCanvas, options, start, cleanup } from "canvas-recorder/gl";
import { ImageShader } from "image-shader";

import shader from "./shader.glsl";

const source: HTMLCanvasElement = document.createElement( "canvas" );

source.width = 1024;
source.height = 1024;

const imageShader = new ImageShader( source, shader );

options( {
    canvas: imageShader.domElement,
    record: false,
    frames: 60 * 6,
} );

draw( ( _, __, t: number ) => {
    imageShader.uniforms.t = t;
    imageShader.update();
} );

document.body.innerHTML = "";
document.body.appendChild( getCanvas() );

start();

cleanup( () => {
    start();
} );
