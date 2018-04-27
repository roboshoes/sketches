import { getCanvas, draw, options, start } from "canvas-recorder/gl";
import { Scene, WebGLRenderer, PerspectiveCamera } from "three";
import { Particles } from "./gl/particles";

import positionShader from "./shaders/position.glsl";
import velocityShader from "./shaders/velocity.glsl";

const camera = new PerspectiveCamera( 90, 1, 1, 10000 );
const scene = new Scene();
const renderer = new WebGLRenderer( { canvas: getCanvas() } );
const particles = new Particles( 128, {
    renderer,

    positionShader,
    positionUniforms: {},

    velocityShader,
    velocityUniforms: {
        alignmentDistance: 5,
        seperationDistance: 40,
        cohesionDistance: 20,
    }
} );

renderer.setClearColor( 0 );
renderer.setSize( 1024, 1024 );

camera.aspect = 1;
camera.updateProjectionMatrix();


scene.add( particles );

options( {
    record: false,
    clear: false,
} );

draw( ( gl: WebGLRenderingContext, now: number ) => {
    particles.update( now );
    renderer.render( scene, camera );
} );

document.body.appendChild( getCanvas() );

start();