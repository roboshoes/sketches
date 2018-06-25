import { draw, getCanvas, options, start } from "canvas-recorder/gl";
import { PerspectiveCamera, Vector3, WebGLRenderer } from "three";

import { World } from "./components/world";

const WIDTH = 1024;
const HEIGHT = 1024;

options( {
    size: [ WIDTH, HEIGHT ],
    record: false,
} );

const canvas = document.createElement( "canvas" );
const camera = new PerspectiveCamera( 90, WIDTH / HEIGHT, 1, 10000 );
const scene = new World();
const renderer = new WebGLRenderer( { canvas: getCanvas() } );

camera.position.set( 50, 30, 0 );
camera.lookAt( new Vector3() );
camera.aspect = WIDTH / HEIGHT;
camera.updateProjectionMatrix();

renderer.setSize( WIDTH, HEIGHT );
renderer.setPixelRatio( 1 );
renderer.setClearColor( 0 );

draw( ( gl: WebGLRenderingContext, time: number ) => {
    scene.loop();

    renderer.render( scene, camera );
} )

document.body.appendChild( getCanvas() );

start();
