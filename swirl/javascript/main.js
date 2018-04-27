import createShader from "gl-shader";
import drawTriangle from "a-big-triangle";
import { options, setup, draw, start, getCanvas } from "canvas-recorder/gl";

const glslify = require( "glslify" );

let shader;

options( {
    record: false,
    size: [ 1024, 1024 ],
} );

setup( gl => {
    gl.viewport( 0, 0, 1024, 1204 );
    gl.disable( gl.DEPTH_TEST );
    gl.enable( gl.BLEND );
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE );

    shader = createShader(
        gl,
        glslify( __dirname + "/shaders/vertex.glsl" ),
        glslify( __dirname + "/shaders/fragment.glsl" )
    );
} );


draw( ( gl, time ) => {
    shader.bind();
    shader.uniforms.resolution = [ 1024, 1024 ];
    shader.uniforms.time = time;

    drawTriangle( gl );
} );

document.body.appendChild( getCanvas() );

start();
