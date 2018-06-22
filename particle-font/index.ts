import { getCanvas, draw, options, start } from "canvas-recorder/gl";
import { Scene, WebGLRenderer, PerspectiveCamera, AmbientLight, Vector3, Mesh, CubeGeometry, MeshBasicMaterial } from "three";
import { Particles } from "./gl/particles";

// @ts-ignore
import positionShader from "./shaders/position.glsl";
// @ts-ignore
import velocityShader from "./shaders/velocity.glsl";

const ambientLight = new AmbientLight( 0x404040 );
const camera = new PerspectiveCamera( 90, 1, 1, 10000 );
const scene = new Scene();
const renderer = new WebGLRenderer( { alpha: false } );
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

document.body.appendChild( getCanvas() );

start();