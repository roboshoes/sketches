import { bootstrap, draw, options } from "canvas-recorder/gl";
import { AmbientLight, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";

import { Particles } from "./particles";
// @ts-ignore
import positionShader from "./shaders/position.fragment.glsl";
// @ts-ignore
import velocityShader from "./shaders/velocity.fragment.glsl";

const ambientLight = new AmbientLight( 0x404040 );
const camera = new PerspectiveCamera( 90, 1, 1, 10000 );
const scene = new Scene();
const renderer = new WebGLRenderer( { alpha: false } );
const particles = new Particles( 128, {
    renderer,

    positionShader,
    positionUniforms: {},

    velocityShader,
    velocityUniforms: {},
} );

renderer.setSize( 1024, 1024 );

camera.aspect = 1;
camera.updateProjectionMatrix();
camera.position.set( 0, 0, -100 );
camera.lookAt( new Vector3() );

scene.add( particles );
scene.add( ambientLight );

options( {
    record: false,
    clear: false,
    canvas: renderer.domElement,
    color: "black",
} );

draw( ( gl: WebGLRenderingContext, now: number ) => {
    particles.update( now );
    renderer.render( scene, camera );
} );

bootstrap();
